package com.migrantcommunity.profile.entity;

import com.migrantcommunity.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles", indexes = {
        @Index(name = "idx_user_profiles_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_user_profiles_location", columnList = "current_location")
})
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 50)
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(name = "hometown_country", length = 100)
    private String hometownCountry;

    @Column(name = "hometown_city", length = 100)
    private String hometownCity;

    @Column(name = "current_location")
    private Point currentLocation;

    @Column(name = "location_accuracy_km")
    private Double locationAccuracyKm;

    @Column(name = "privacy_settings", columnDefinition = "JSONB")
    private String privacySettings;

    @Column(name = "discovery_enabled")
    private boolean discoveryEnabled = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public Profile() {
    }

    public Profile(Long id, User user, String firstName, String lastName, LocalDate dateOfBirth, String gender,
                   String bio, String profilePictureUrl, String hometownCountry, String hometownCity,
                   Point currentLocation, Double locationAccuracyKm, String privacySettings,
                   boolean discoveryEnabled, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.bio = bio;
        this.profilePictureUrl = profilePictureUrl;
        this.hometownCountry = hometownCountry;
        this.hometownCity = hometownCity;
        this.currentLocation = currentLocation;
        this.locationAccuracyKm = locationAccuracyKm;
        this.privacySettings = privacySettings;
        this.discoveryEnabled = discoveryEnabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public String getHometownCountry() { return hometownCountry; }
    public void setHometownCountry(String hometownCountry) { this.hometownCountry = hometownCountry; }
    public String getHometownCity() { return hometownCity; }
    public void setHometownCity(String hometownCity) { this.hometownCity = hometownCity; }
    public Point getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(Point currentLocation) { this.currentLocation = currentLocation; }
    public Double getLocationAccuracyKm() { return locationAccuracyKm; }
    public void setLocationAccuracyKm(Double locationAccuracyKm) { this.locationAccuracyKm = locationAccuracyKm; }
    public String getPrivacySettings() { return privacySettings; }
    public void setPrivacySettings(String privacySettings) { this.privacySettings = privacySettings; }
    public boolean isDiscoveryEnabled() { return discoveryEnabled; }
    public void setDiscoveryEnabled(boolean discoveryEnabled) { this.discoveryEnabled = discoveryEnabled; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
