package com.migrantcommunity.notification.repository;

import com.migrantcommunity.notification.entity.PlatformNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformNotificationRepository extends JpaRepository<PlatformNotification, Long> {
}
