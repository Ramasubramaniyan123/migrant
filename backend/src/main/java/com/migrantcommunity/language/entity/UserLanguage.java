package com.migrantcommunity.language.entity;

import com.migrantcommunity.common.enums.ProficiencyLevel;
import com.migrantcommunity.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "user_languages", 
       indexes = {
           @Index(name = "idx_user_languages_user_id", columnList = "user_id"),
           @Index(name = "idx_user_languages_language_id", columnList = "language_id")
       },
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_user_language", columnNames = {"user_id", "language_id"})
       })
public class UserLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level", length = 50)
    private ProficiencyLevel proficiencyLevel;

    @Column(name = "is_primary")
    private boolean primary = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public UserLanguage() {
    }

    public UserLanguage(User user, Language language, ProficiencyLevel proficiencyLevel, boolean primary) {
        this.user = user;
        this.language = language;
        this.proficiencyLevel = proficiencyLevel;
        this.primary = primary;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
