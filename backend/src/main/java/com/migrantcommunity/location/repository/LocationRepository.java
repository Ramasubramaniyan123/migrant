package com.migrantcommunity.location.repository;

import com.migrantcommunity.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByType(Location.Type type);
    List<Location> findByTypeAndCountry(Location.Type type, String country);
    List<Location> findByParentId(Long parentId);
    Optional<Location> findByNameIgnoreCaseAndType(String name, Location.Type type);
    List<Location> findByNameContainingIgnoreCase(String name);
    long countByType(Location.Type type);
}
