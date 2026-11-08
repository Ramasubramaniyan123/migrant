package com.migrantcommunity.location.service;

import com.migrantcommunity.location.dto.City;
import com.migrantcommunity.location.dto.Locality;
import com.migrantcommunity.location.entity.Location;
import com.migrantcommunity.location.repository.LocationRepository;
import com.migrantcommunity.profile.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminLocationService {

    private final LocationRepository locationRepository;
    private final ProfileRepository profileRepository;

    public AdminLocationService(LocationRepository locationRepository,
                                ProfileRepository profileRepository) {
        this.locationRepository = locationRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<City> listCities() {
        return locationRepository.findByType(Location.Type.CITY).stream()
                .map(this::toCityDto).toList();
    }

    @Transactional(readOnly = true)
    public List<Locality> listLocalities(String cityId) {
        List<Location> rows;
        if (cityId == null || cityId.isBlank()) {
            rows = locationRepository.findByType(Location.Type.LOCALITY);
        } else {
            rows = locationRepository.findByParentId(parseId(cityId));
        }
        return rows.stream()
                .filter(l -> l.getType() == Location.Type.LOCALITY || cityId != null && !cityId.isBlank())
                .map(this::toLocalityDto).toList();
    }

    public Locality createLocality(String name, String cityId) {
        Location city = locationRepository.findById(parseId(cityId))
                .filter(l -> l.getType() == Location.Type.CITY)
                .orElseThrow(() -> new IllegalArgumentException("City not found"));
        Location locality = new Location();
        locality.setName(name.trim());
        locality.setType(Location.Type.LOCALITY);
        locality.setParent(city);
        locality.setCountry(city.getCountry());
        locality.setState(city.getState());
        locality.setCity(city.getName());
        return toLocalityDto(locationRepository.save(locality));
    }

    public Locality updateLocality(String id, String name) {
        Location locality = locationRepository.findById(parseId(id))
                .filter(l -> l.getType() == Location.Type.LOCALITY)
                .orElseThrow(() -> new IllegalArgumentException("Locality not found"));
        if (name != null && !name.isBlank()) {
            locality.setName(name.trim());
        }
        return toLocalityDto(locationRepository.save(locality));
    }

    public static record LocStats(long totalCities, long totalLocalities, long usersInTrackedLocations) {}

    @Transactional(readOnly = true)
    public LocStats getStats() {
        long cities = locationRepository.countByType(Location.Type.CITY);
        long localities = locationRepository.countByType(Location.Type.LOCALITY);
        long users = locationRepository.findByType(Location.Type.CITY).stream()
                .mapToLong(c -> profileRepository.countUsersInCity(c.getName()))
                .sum();
        return new LocStats(cities, localities, users);
    }

    private City toCityDto(Location l) {
        long localities = locationRepository.findByParentId(l.getId()).stream()
                .filter(x -> x.getType() == Location.Type.LOCALITY).count();
        return new City(
                String.valueOf(l.getId()),
                l.getName(),
                l.getState(),
                profileRepository.countUsersInCity(l.getName()),
                localities);
    }

    private Locality toLocalityDto(Location l) {
        Location parent = l.getParent();
        return new Locality(
                String.valueOf(l.getId()),
                l.getName(),
                parent != null ? String.valueOf(parent.getId()) : null,
                parent != null ? parent.getName() : l.getCity(),
                profileRepository.countUsersInCity(l.getName()));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Location not found");
        }
    }
}
