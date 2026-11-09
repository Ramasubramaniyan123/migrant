import { request } from './api';
import { calculateDistanceKm } from '@/utils/distanceCalculator';

/* ------------------------------------------------------------------ *
 * Language catalog                                                     *
 *                                                                     *
 * `GET /v1/languages/list` returns `{ code, name, nativeName }` — the  *
 * user-facing API does not expose the numeric language id, so catalog  *
 * entries use `code` as their `id`. Numeric `languageId`s coming from *
 * profile/community payloads are tracked in `knownLanguages` so names *
 * still resolve for display.                                          *
 * ------------------------------------------------------------------ */

export const languages = [];
const knownLanguages = new Map();

function rememberLanguage(entry) {
  if (!entry || entry.id === null || entry.id === undefined) return;
  const record = {
    id: entry.id,
    name: entry.name,
    nativeName: entry.nativeName ?? entry.code,
    code: entry.code
  };
  knownLanguages.set(String(entry.id), record);
}

/** Fetches the platform language list into the module-level `languages` array. */
export async function loadLanguages() {
  try {
    const rows = await request('/v1/languages/list');
    if (!Array.isArray(rows)) return;
    languages.length = 0;
    rows.forEach(row => {
      const language = {
        id: row.code,
        code: row.code,
        name: row.name,
        nativeName: row.nativeName
      };
      languages.push(language);
      rememberLanguage(language);
    });
  } catch {
    // Languages are reference data — keep the last known list on failure.
  }
}

export function languageById(id) {
  if (id === null || id === undefined) return undefined;
  const key = String(id);
  return languages.find(language => String(language.id) === key) ?? knownLanguages.get(key);
}

/* ------------------------------------------------------------------ *
 * Frontend user shape                                                  *
 *                                                                     *
 * The UI expects `{ id, email, role, isActive, isVerified, createdAt,  *
 * profile: {...} }`. `profile/details` supplies most fields; fields the *
 * backend does not expose (currentCountry, exact onboarding flag) are  *
 * left undefined/defaulted.                                           *
 * ------------------------------------------------------------------ */

export const DEFAULT_PRIVACY = {
  showHometown: true,
  showCurrentCity: true,
  showExactLocation: false,
  allowConnectionRequests: true,
  allowDirectMessages: true,
  showOnlineStatus: true,
  discoverable: true
};

function emptyProfile() {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: undefined,
    gender: undefined,
    bio: '',
    avatarUrl: undefined,
    hometownCity: undefined,
    hometownCountry: undefined,
    currentCity: undefined,
    currentCountry: undefined,
    latitude: undefined,
    longitude: undefined,
    privacy: { ...DEFAULT_PRIVACY },
    languages: [],
    interests: [],
    onboardingCompleted: false
  };
}

function mapProfileDetails(details) {
  const privacy = details.privacy ?? {};
  return {
    firstName: details.firstName ?? '',
    lastName: details.lastName ?? '',
    dateOfBirth: details.dateOfBirth ?? undefined,
    gender: details.gender ?? undefined,
    bio: details.bio ?? '',
    avatarUrl: details.profilePictureUrl ?? undefined,
    hometownCity: details.hometownCity ?? undefined,
    hometownCountry: details.hometownCountry ?? undefined,
    // The API stores a current city via /profile/location but does not
    // return it in ProfileDetailsResponse — left undefined.
    currentCity: undefined,
    currentCountry: undefined,
    latitude: details.latitude ?? undefined,
    longitude: details.longitude ?? undefined,
    privacy: {
      ...DEFAULT_PRIVACY,
      showHometown: privacy.showHometown ?? DEFAULT_PRIVACY.showHometown,
      showCurrentCity: privacy.showCurrentCity ?? DEFAULT_PRIVACY.showCurrentCity,
      showExactLocation: privacy.showExactLocation ?? DEFAULT_PRIVACY.showExactLocation,
      allowConnectionRequests: privacy.allowConnectionRequests ?? DEFAULT_PRIVACY.allowConnectionRequests,
      allowDirectMessages: privacy.allowDirectMessages ?? DEFAULT_PRIVACY.allowDirectMessages,
      showOnlineStatus: privacy.showOnlineStatus ?? DEFAULT_PRIVACY.showOnlineStatus,
      discoverable: privacy.discoverable ?? DEFAULT_PRIVACY.discoverable
    },
    languages: (details.languages ?? []).map(entry => {
      rememberLanguage({ id: entry.languageId, name: entry.name, code: entry.code });
      return {
        languageId: entry.languageId,
        proficiency: entry.proficiency ?? 'INTERMEDIATE',
        isPrimary: Boolean(entry.primary),
        name: entry.name,
        code: entry.code
      };
    }),
    interests: details.interests ?? [],
    onboardingCompleted: true
  };
}

/** Combines `/v1/auth/me` (account flags) with `/v1/profile/details` into the UI user shape. */
export function toFrontendUser(summary, details) {
  return {
    id: Number(summary?.userId ?? details?.userId),
    email: summary?.email ?? details?.email ?? '',
    role: summary?.role ?? 'USER',
    isActive: summary?.active ?? true,
    isVerified: summary?.verified ?? false,
    createdAt: details?.createdAt ?? undefined,
    profile: details ? mapProfileDetails(details) : emptyProfile()
  };
}

/** Minimal user built straight from an `AuthResponse` when the profile API is unreachable. */
export function minimalUser(auth, { verified = null } = {}) {
  return {
    id: Number(auth.userId),
    email: auth.email ?? '',
    role: auth.role ?? 'USER',
    isActive: true,
    isVerified: verified,
    createdAt: undefined,
    profile: emptyProfile()
  };
}

/* ------------------------------------------------------------------ *
 * Directory helpers                                                    *
 * ------------------------------------------------------------------ */

/** In-memory directory populated by `getUsers()` for name/avatar lookups. */
const directoryCache = new Map();

export function findUserById(id) {
  return directoryCache.get(String(id));
}

export function fullName(user) {
  const profile = user?.profile;
  const name = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();
  return name || user?.fullName || user?.email || 'Member';
}

export function languageNamesOf(user) {
  return (user?.profile?.languages ?? [])
    .map(entry => languageById(entry.languageId)?.name ?? entry.name)
    .filter(Boolean);
}

/** Flattens a `User` into the compact shape used by cards and lists. */
export function toUserSummary(user, options = {}) {
  const { profile } = user;
  const distanceKm =
    options.from && profile?.latitude !== undefined && profile?.longitude !== undefined
      ? calculateDistanceKm(options.from, {
          latitude: profile.latitude,
          longitude: profile.longitude
        })
      : undefined;
  return {
    id: user.id,
    fullName: fullName(user),
    avatarUrl: profile?.avatarUrl,
    hometownCity: profile?.privacy?.showHometown === false ? undefined : profile?.hometownCity,
    hometownCountry: profile?.hometownCountry,
    currentCity: profile?.currentCity,
    bio: profile?.bio,
    interests: profile?.interests ?? [],
    languageNames: languageNamesOf(user),
    languageIds: (profile?.languages ?? []).map(entry => entry.languageId),
    distanceKm,
    matchScore: options.matchScore
  };
}

/** Builds a directory user from a lightweight member record (name + avatar only). */
export function memberToUser(member) {
  const displayName = member.displayName ?? member.name ?? 'Member';
  const [firstName, ...rest] = displayName.trim().split(/\s+/);
  const user = {
    id: Number(member.userId ?? member.id),
    email: '',
    role: 'USER',
    isActive: true,
    isVerified: true,
    createdAt: undefined,
    profile: {
      ...emptyProfile(),
      firstName: firstName ?? '',
      lastName: rest.join(' '),
      avatarUrl: member.avatarUrl ?? undefined
    }
  };
  directoryCache.set(String(user.id), user);
  return user;
}

function discoveredToUser(discovered) {
  const displayName = discovered.displayName ?? 'Member';
  const [firstName, ...rest] = displayName.trim().split(/\s+/);
  const languages = (discovered.languages ?? []).map(name => ({
    languageId: `name:${name}`,
    proficiency: 'INTERMEDIATE',
    isPrimary: false,
    name
  }));
  const user = {
    id: Number(discovered.userId),
    email: '',
    role: 'USER',
    isActive: true,
    isVerified: true,
    createdAt: undefined,
    profile: {
      ...emptyProfile(),
      firstName: firstName ?? '',
      lastName: rest.join(' '),
      avatarUrl: discovered.avatarUrl ?? undefined,
      hometownCity: discovered.hometownCity ?? undefined,
      hometownCountry: discovered.hometownCountry ?? undefined,
      currentCity: discovered.currentCity ?? undefined,
      languages,
      interests: [],
      onboardingCompleted: true
    }
  };
  directoryCache.set(String(user.id), user);
  return user;
}

/* ------------------------------------------------------------------ *
 * Service                                                             *
 * ------------------------------------------------------------------ */

const toNumericId = value => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const userService = {
  /** Loads the language catalog into the module-level `languages` array. */
  loadLanguages,

  /**
   * Directory of discoverable users. There is no "list all users" endpoint —
   * this uses the privacy-aware discovery feed as the directory source.
   */
  async getUsers() {
    const page = await request('/v1/discovery/suggestions?size=100&page=0');
    const rows = (page?.content ?? []).map(discoveredToUser);
    rows.forEach(user => directoryCache.set(String(user.id), user));
    return rows;
  },

  async getUserById(id) {
    const cached = findUserById(id);
    if (cached) return cached;
    // Fall back to a directory refresh for ids not yet cached.
    await userService.getUsers();
    const found = findUserById(id);
    if (!found) throw new Error(`User ${id} not found`);
    return found;
  },

  async getSummaries(from) {
    const users = await userService.getUsers();
    return users.map(user => toUserSummary(user, from ? { from } : {}));
  },

  /**
   * Returns the signed-in user's full profile in the UI shape.
   * Combines `GET /v1/auth/me` (account flags) with `GET /v1/profile/details`.
   */
  async getCurrentUser() {
    const summary = await request('/v1/auth/me');
    let details = null;
    try {
      details = await request('/v1/profile/details');
    } catch {
      details = null;
    }
    return toFrontendUser(summary, details);
  },

  /**
   * Updates the signed-in user's profile. Maps the UI patch onto the
   * profile endpoints: `PUT /me`, `PUT /privacy`, `PUT /location` and the
   * per-language add/remove endpoints.
   *
   * Not persisted (no backend support): `interests`, `currentCountry`,
   * non-numeric `languageId`s.
   */
  async updateProfile(id, patch = {}) {
    const profilePayload = {};
    for (const key of ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bio', 'hometownCity', 'hometownCountry']) {
      if (patch[key] !== undefined) profilePayload[key] = patch[key];
    }

    const calls = [];
    if (Object.keys(profilePayload).length > 0) {
      calls.push(request('/v1/profile/me', { method: 'PUT', body: profilePayload }));
    }

    if (patch.privacy) {
      const p = patch.privacy;
      calls.push(
        request('/v1/profile/privacy', {
          method: 'PUT',
          body: {
            showHometown: p.showHometown ?? DEFAULT_PRIVACY.showHometown,
            showCurrentCity: p.showCurrentCity ?? DEFAULT_PRIVACY.showCurrentCity,
            showExactLocation: p.showExactLocation ?? DEFAULT_PRIVACY.showExactLocation,
            allowConnectionRequests: p.allowConnectionRequests ?? DEFAULT_PRIVACY.allowConnectionRequests,
            allowDirectMessages: p.allowDirectMessages ?? DEFAULT_PRIVACY.allowDirectMessages,
            showOnlineStatus: p.showOnlineStatus ?? DEFAULT_PRIVACY.showOnlineStatus,
            discoverable: p.discoverable ?? DEFAULT_PRIVACY.discoverable
          }
        })
      );
    }

    if (patch.latitude !== undefined || patch.longitude !== undefined) {
      calls.push(
        request('/v1/profile/location', {
          method: 'PUT',
          body: {
            latitude: patch.latitude,
            longitude: patch.longitude,
            accuracyKm: patch.locationAccuracyKm,
            city: patch.currentCity
          }
        })
      );
    }

    if (Array.isArray(patch.languages)) {
      calls.push(syncLanguages(patch.languages));
    }

    await Promise.all(calls);
    return userService.getCurrentUser();
  },

  async completeOnboarding(id, patch = {}) {
    const user = await userService.updateProfile(id, patch);
    return {
      ...user,
      profile: { ...user.profile, onboardingCompleted: true }
    };
  },

  /** Deactivates the account (`POST /v1/profile/deactivate`). */
  async deactivateAccount() {
    return request('/v1/profile/deactivate', { method: 'POST' });
  }
};

/** Diffs desired languages against the server's list and applies add/remove calls. */
async function syncLanguages(desired) {
  const details = await request('/v1/profile/details');
  const current = new Map(
    (details?.languages ?? []).map(entry => [String(entry.languageId), entry])
  );
  const wanted = new Map();
  desired.forEach(entry => {
    const numericId = toNumericId(entry.languageId);
    if (numericId !== null) wanted.set(String(numericId), entry);
  });

  const calls = [];
  for (const [key, entry] of wanted) {
    if (!current.has(key)) {
      const params = new URLSearchParams();
      if (entry.proficiency) params.set('proficiency', entry.proficiency);
      params.set('primary', entry.isPrimary ? 'true' : 'false');
      calls.push(
        request(`/v1/profile/languages/${key}?${params.toString()}`, { method: 'POST' })
      );
    }
  }
  for (const key of current.keys()) {
    if (!wanted.has(key)) {
      calls.push(request(`/v1/profile/languages/${key}`, { method: 'DELETE' }));
    }
  }
  await Promise.all(calls);
}

