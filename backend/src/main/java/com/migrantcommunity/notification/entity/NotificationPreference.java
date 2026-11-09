package com.migrantcommunity.notification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/** Per-user notification preferences (table created in V14__extend_schema.sql). */
@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email_enabled", nullable = false)
    private boolean emailEnabled = true;

    @Column(name = "push_enabled", nullable = false)
    private boolean pushEnabled = true;

    @Column(name = "connection_requests", nullable = false)
    private boolean connectionRequests = true;

    @Column(name = "messages", nullable = false)
    private boolean messages = true;

    @Column(name = "community_activity", nullable = false)
    private boolean communityActivity = true;

    @Column(name = "reactions", nullable = false)
    private boolean reactions = true;

    @Column(name = "events", nullable = false)
    private boolean events = true;

    @Column(name = "announcements", nullable = false)
    private boolean announcements = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public boolean isEmailEnabled() { return emailEnabled; }
    public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }
    public boolean isPushEnabled() { return pushEnabled; }
    public void setPushEnabled(boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    public boolean isConnectionRequests() { return connectionRequests; }
    public void setConnectionRequests(boolean connectionRequests) { this.connectionRequests = connectionRequests; }
    public boolean isMessages() { return messages; }
    public void setMessages(boolean messages) { this.messages = messages; }
    public boolean isCommunityActivity() { return communityActivity; }
    public void setCommunityActivity(boolean communityActivity) { this.communityActivity = communityActivity; }
    public boolean isReactions() { return reactions; }
    public void setReactions(boolean reactions) { this.reactions = reactions; }
    public boolean isEvents() { return events; }
    public void setEvents(boolean events) { this.events = events; }
    public boolean isAnnouncements() { return announcements; }
    public void setAnnouncements(boolean announcements) { this.announcements = announcements; }
}
