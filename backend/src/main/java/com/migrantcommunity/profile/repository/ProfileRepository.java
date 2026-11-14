package com.migrantcommunity.profile.repository;

import com.migrantcommunity.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserId(Long userId);

    Optional<Profile> findByUser_Id(Long userId);

    @org.springframework.data.jpa.repository.Query(
            "SELECT p.currentCity, COUNT(p) FROM Profile p WHERE p.currentCity IS NOT NULL GROUP BY p.currentCity")
    List<Object[]> countUsersByCity();

    @org.springframework.data.jpa.repository.Query(
            "SELECT COUNT(p) FROM Profile p WHERE p.currentCity = :city OR p.hometownCity = :city")
    long countUsersInCity(@org.springframework.data.repository.query.Param("city") String city);
}
