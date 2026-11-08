package com.migrantcommunity.admin.repository;

import com.migrantcommunity.admin.entity.AdminPasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminPasswordResetTokenRepository extends JpaRepository<AdminPasswordResetToken, Long> {
    Optional<AdminPasswordResetToken> findByToken(String token);
}
