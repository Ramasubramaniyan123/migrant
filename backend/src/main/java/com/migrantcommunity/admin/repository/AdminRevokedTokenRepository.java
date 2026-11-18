package com.migrantcommunity.admin.repository;

import com.migrantcommunity.admin.entity.AdminRevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface AdminRevokedTokenRepository extends JpaRepository<AdminRevokedToken, String> {

    boolean existsByJti(String jti);

    @Modifying
    @Query("DELETE FROM AdminRevokedToken t WHERE t.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);
}
