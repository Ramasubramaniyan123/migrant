package com.migrantcommunity.security;

import com.migrantcommunity.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUserAndRevokedFalse(User user);
    long countByUserAndRevokedFalse(User user);
    void deleteByUser(User user);

    @org.springframework.data.jpa.repository.Query(
            "SELECT MAX(s.lastActiveAt) FROM UserSession s WHERE s.user.id = :userId")
    java.time.Instant findLastActiveAtByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query(
            "SELECT s.user.id, MAX(s.lastActiveAt) FROM UserSession s GROUP BY s.user.id")
    List<Object[]> findLastActiveAtByUserIds();

    @org.springframework.data.jpa.repository.Query(
            "SELECT COUNT(DISTINCT s.user.id) FROM UserSession s " +
            "WHERE s.lastActiveAt >= :since AND s.revoked = false")
    long countActiveUsersSince(@org.springframework.data.repository.query.Param("since") java.time.Instant since);

    @org.springframework.data.jpa.repository.Query(
            "SELECT COUNT(DISTINCT s.user.id) FROM UserSession s JOIN s.user u " +
            "WHERE u.createdAt < :registeredBefore AND s.lastActiveAt >= :activeSince AND s.revoked = false")
    long countRetainedUsers(@org.springframework.data.repository.query.Param("registeredBefore") java.time.Instant registeredBefore,
                            @org.springframework.data.repository.query.Param("activeSince") java.time.Instant activeSince);

    @org.springframework.data.jpa.repository.Query(
            "SELECT COUNT(DISTINCT u.id) FROM User u WHERE u.createdAt < :registeredBefore")
    long countUsersRegisteredBefore(@org.springframework.data.repository.query.Param("registeredBefore") java.time.Instant registeredBefore);
}
