package com.migrantcommunity.profile.repository;

import com.migrantcommunity.profile.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
    List<UserInterest> findByUserId(Long userId);
    void deleteByUserIdAndInterest(Long userId, String interest);
    boolean existsByUserIdAndInterest(Long userId, String interest);
}
