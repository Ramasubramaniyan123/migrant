import { request } from './api';

/** Maps backend match reasons onto the frontend `MATCH_REASON_LABELS` keys. */
function mapMatchReason(reason) {
  switch (reason) {
    case 'HOMETOWN':
      return 'HOMETOWN';
    case 'LANGUAGE':
      return 'LANGUAGE';
    case 'INTERESTS':
      return 'INTERESTS';
    case 'NEARBY':
    case 'DISCOVERED':
    default:
      return 'LOCATION';
  }
}

/** Adapts a `DiscoveredUser` DTO to the summary shape the UI cards expect. */
export function discoveredToSummary(discovered) {
  return {
    id: Number(discovered.userId),
    fullName: discovered.displayName ?? 'Member',
    avatarUrl: discovered.avatarUrl ?? undefined,
    hometownCity: discovered.hometownCity ?? undefined,
    hometownCountry: discovered.hometownCountry ?? undefined,
    currentCity: discovered.currentCity ?? undefined,
    bio: undefined,
    interests: [],
    languageNames: discovered.languages ?? [],
    languageIds: [],
    distanceKm: discovered.distanceKm ?? undefined,
    matchScore: undefined,
    matchReason: mapMatchReason(discovered.matchReason)
  };
}

function coordinatesOf(user) {
  const { latitude, longitude } = user?.profile ?? {};
  if (latitude === undefined || longitude === undefined) return undefined;
  return { latitude, longitude };
}

export const discoveryService = {
  /**
   * `GET /v1/discovery/suggestions` — privacy-aware people discovery.
   *
   * Backend-supported filters: radiusKm, latitude/longitude, hometownCity,
   * currentCity, languageId (numeric only), interest (single), page/size.
   * `query`, `sortBy`, `hometownCountry` and multi-interest filters are
   * applied client-side on the returned page.
   */
  async discoverPeople(current, filters = {}) {
    const params = new URLSearchParams({ page: '0', size: '100' });

    // Without an explicit distance cap, ask for the widest allowed radius so
    // unfiltered searches are not silently limited to the 50 km default.
    const radiusKm = filters.maxDistanceKm ?? 500;
    if (radiusKm !== undefined && radiusKm !== null) {
      params.set('radiusKm', String(Math.min(Math.max(radiusKm, 1), 500)));
    }

    const center = coordinatesOf(current);
    if (center) {
      params.set('latitude', String(center.latitude));
      params.set('longitude', String(center.longitude));
    }
    if (filters.hometownCity) params.set('hometownCity', filters.hometownCity);
    if (filters.currentCity) params.set('currentCity', filters.currentCity);
    const languageId = Number(filters.languageId);
    if (Number.isFinite(languageId)) params.set('languageId', String(languageId));
    const interest = filters.interests?.[0] ?? filters.interest;
    if (interest) params.set('interest', interest);

    const page = await request(`/v1/discovery/suggestions?${params.toString()}`);
    let users = (page?.content ?? []).map(discoveredToSummary);

    // Client-side filters the backend does not support.
    const query = filters.query?.trim().toLowerCase() ?? '';
    if (query) {
      users = users.filter(person =>
        [person.fullName, person.hometownCity ?? '', person.hometownCountry ?? '', person.currentCity ?? '', ...(person.languageNames ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }
    if (filters.hometownCountry) {
      users = users.filter(person => person.hometownCountry === filters.hometownCountry);
    }
    // Note: DiscoveredUser carries no interest list, so additional selected
    // interests beyond the first (sent as the `interest` param) cannot be
    // verified client-side.

    const sortBy = filters.sortBy ?? 'match';
    if (sortBy === 'distance') {
      users = [...users].sort((a, b) => (a.distanceKm ?? Number.MAX_VALUE) - (b.distanceKm ?? Number.MAX_VALUE));
    } else if (sortBy === 'recent') {
      users = [...users].sort((a, b) => b.id - a.id);
    }

    return { users, total: page?.totalElements ?? users.length };
  },

  /** Nearby people within `radiusKm` — same endpoint with a tighter radius. */
  async getNearbyPeople(current, radiusKm = 25) {
    const params = new URLSearchParams({ page: '0', size: '100', radiusKm: String(radiusKm) });
    const center = coordinatesOf(current);
    if (center) {
      params.set('latitude', String(center.latitude));
      params.set('longitude', String(center.longitude));
    }
    const page = await request(`/v1/discovery/suggestions?${params.toString()}`);
    return (page?.content ?? [])
      .map(discoveredToSummary)
      .filter(person => person.distanceKm === undefined || person.distanceKm <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  },

  /** Hometown matches — `GET /v1/discovery/hometown`. */
  async discoverByHometown(hometownCity, page = 0, size = 20) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (hometownCity) params.set('hometownCity', hometownCity);
    const result = await request(`/v1/discovery/hometown?${params.toString()}`);
    return (result?.content ?? []).map(discoveredToSummary);
  }
};
