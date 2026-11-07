package com.migrantcommunity.event.entity;

import com.migrantcommunity.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "event_participants",
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_event_user", columnNames = {"event_id", "user_id"})
       },
       indexes = {
           @Index(name = "idx_event_participants_event", columnList = "event_id"),
           @Index(name = "idx_event_participants_user", columnList = "user_id")
       })
public class EventParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private CommunityEvent event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String status = "ATTENDING";

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private Instant joinedAt;

    public EventParticipant() {
    }

    public EventParticipant(CommunityEvent event, User user, String status) {
        this.event = event;
        this.user = user;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CommunityEvent getEvent() { return event; }
    public void setEvent(CommunityEvent event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}
