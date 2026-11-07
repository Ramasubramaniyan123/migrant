package com.migrantcommunity.user.repository;

import com.migrantcommunity.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    long countByActive(boolean active);
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
