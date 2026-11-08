package com.migrantcommunity.notification.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "platform_notifications", indexes = {
        @Index(name = "idx_platform_notifications_sent_at", columnList = "sent_at")
})
public class PlatformNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 50)
    private String audience;

    @Column(name = "sent_by", length = 255)
    private String sentBy;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false, nullable = false)
    private Instant sentAt;

    @Column(name = "recipient_count", nullable = false)
    private long recipientCount;

    @Column(nullable = false, length = 50)
    private String status = "SENT";

    public PlatformNotification() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }

    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }

    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }

    public long getRecipientCount() { return recipientCount; }
    public void setRecipientCount(long recipientCount) { this.recipientCount = recipientCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
