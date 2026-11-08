package com.migrantcommunity.community.entity;

import com.migrantcommunity.language.entity.Language;
import com.migrantcommunity.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "communities", indexes = {
        @Index(name = "idx_communities_language", columnList = "language_id")
})
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id")
    private Language language;

    @Column(name = "location_country", length = 100)
    private String locationCountry;

    @Column(name = "location_city", length = 100)
    private String locationCity;

    @Enumerated(EnumType.STRING)
    @Column(name = "community_type", length = 30)
    private com.migrantcommunity.common.enums.CommunityType type;

    @Column(length = 100)
    private String hometown;

    @Column(name = "is_public")
    private boolean publicCommunity = true;

    @Column(name = "member_count")
    private int memberCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CommunityMember> members = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Community() {
    }

    public Community(String name, String description, Language language, String locationCountry, 
                    String locationCity, boolean publicCommunity, User createdBy) {
        this.name = name;
        this.description = description;
        this.language = language;
        this.locationCountry = locationCountry;
        this.locationCity = locationCity;
        this.publicCommunity = publicCommunity;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getLocationCountry() { return locationCountry; }
    public void setLocationCountry(String locationCountry) { this.locationCountry = locationCountry; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public com.migrantcommunity.common.enums.CommunityType getType() { return type; }
    public void setType(com.migrantcommunity.common.enums.CommunityType type) { this.type = type; }

    public String getHometown() { return hometown; }
    public void setHometown(String hometown) { this.hometown = hometown; }

    public boolean isPublicCommunity() { return publicCommunity; }
    public void setPublicCommunity(boolean publicCommunity) { this.publicCommunity = publicCommunity; }

    public int getMemberCount() { return memberCount; }
    public void setMemberCount(int memberCount) { this.memberCount = memberCount; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public Set<CommunityMember> getMembers() { return members; }
    public void setMembers(Set<CommunityMember> members) { this.members = members; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void incrementMemberCount() {
        this.memberCount++;
    }

    public void decrementMemberCount() {
        if (this.memberCount > 0) {
            this.memberCount--;
        }
    }
}
