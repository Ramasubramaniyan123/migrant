package com.migrantcommunity.notification.service;

import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.notification.dto.NotificationResponse;
import com.migrantcommunity.notification.entity.Notification;
import com.migrantcommunity.notification.repository.NotificationRepository;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                             UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public NotificationResponse createNotification(Long userId, NotificationType type, 
                                                  String title, String content, Long relatedId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Notification notification = new Notification(user, type, title, content, relatedId);
        notification = notificationRepository.save(notification);

        return toResponse(notification);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository
            .findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUnreadNotifications(Long userId, Pageable pageable) {
        return notificationRepository
            .findUnreadByUserId(userId, pageable)
            .map(this::toResponse);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only mark your own notifications as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        Page<Notification> unread = notificationRepository.findUnreadByUserId(userId, Pageable.unpaged());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getType(),
            notification.getTitle(),
            notification.getContent(),
            notification.getRelatedId(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }
}
