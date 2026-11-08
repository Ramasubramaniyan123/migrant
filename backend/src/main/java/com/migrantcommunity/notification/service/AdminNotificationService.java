package com.migrantcommunity.notification.service;

import com.migrantcommunity.common.enums.BroadcastAudience;
import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.enums.PlatformNotificationType;
import com.migrantcommunity.notification.dto.PlatformNotification;
import com.migrantcommunity.notification.entity.Notification;
import com.migrantcommunity.notification.repository.NotificationRepository;
import com.migrantcommunity.notification.repository.PlatformNotificationRepository;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminNotificationService {

    private final PlatformNotificationRepository platformNotificationRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public AdminNotificationService(PlatformNotificationRepository platformNotificationRepository,
                                    NotificationRepository notificationRepository,
                                    UserRepository userRepository) {
        this.platformNotificationRepository = platformNotificationRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PlatformNotification> list() {
        return platformNotificationRepository.findAll().stream()
                .sorted((a, b) -> b.getSentAt().compareTo(a.getSentAt()))
                .map(this::toDto).toList();
    }

    public PlatformNotification broadcast(String title, String body,
                                          PlatformNotificationType type, BroadcastAudience audience) {
        com.migrantcommunity.notification.entity.PlatformNotification record =
                new com.migrantcommunity.notification.entity.PlatformNotification();
        record.setTitle(title);
        record.setBody(body);
        record.setType(type.name());
        record.setAudience(audience.name());
        record.setStatus("SENT");

        List<User> recipients = selectRecipients(audience);
        record.setRecipientCount(recipients.size());

        NotificationType userType = switch (type) {
            case MAINTENANCE -> NotificationType.SYSTEM;
            case EVENT -> NotificationType.EVENT;
            case POLICY, ANNOUNCEMENT -> NotificationType.SYSTEM;
        };
        for (User recipient : recipients) {
            Notification n = new Notification();
            n.setUser(recipient);
            n.setType(userType);
            n.setTitle(title);
            n.setContent(body);
            notificationRepository.save(n);
        }

        return toDto(platformNotificationRepository.save(record));
    }

    private List<User> selectRecipients(BroadcastAudience audience) {
        return switch (audience) {
            case ALL -> userRepository.findAll();
            case ACTIVE_USERS -> userRepository.findAll().stream()
                    .filter(User::isActive).toList();
            case NEW_USERS -> {
                var since = java.time.Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS);
                yield userRepository.findAll().stream()
                        .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(since))
                        .toList();
            }
            case COMMUNITY_MEMBERS -> userRepository.findAll().stream()
                    .filter(u -> u.getProfile() != null).toList();
        };
    }

    @Transactional(readOnly = true)
    public List<PlatformNotification> history() {
        return list();
    }

    private PlatformNotification toDto(com.migrantcommunity.notification.entity.PlatformNotification n) {
        return new PlatformNotification(
                String.valueOf(n.getId()),
                n.getTitle(),
                n.getBody(),
                PlatformNotificationType.valueOf(n.getType()),
                BroadcastAudience.valueOf(n.getAudience()),
                n.getSentBy(),
                n.getSentAt() != null ? n.getSentAt().toString() : null,
                n.getRecipientCount(),
                n.getStatus());
    }
}
