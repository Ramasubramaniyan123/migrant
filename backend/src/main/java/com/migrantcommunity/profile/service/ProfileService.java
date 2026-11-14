package com.migrantcommunity.profile.service;

import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.language.entity.Language;
import com.migrantcommunity.language.entity.UserLanguage;
import com.migrantcommunity.language.repository.LanguageRepository;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import com.migrantcommunity.profile.PrivacySettings;
import com.migrantcommunity.profile.dto.LocationUpdateRequest;
import com.migrantcommunity.profile.dto.PrivacySettingsRequest;
import com.migrantcommunity.profile.dto.ProfileDetailsResponse;
import com.migrantcommunity.profile.dto.ProfileUpdateRequest;
import com.migrantcommunity.profile.dto.ProfileResponse;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.profile.entity.UserInterest;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final UserLanguageRepository userLanguageRepository;
    private final LanguageRepository languageRepository;
    private final com.migrantcommunity.profile.repository.UserInterestRepository userInterestRepository;
    private final CurrentUserProvider currentUserProvider;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          UserLanguageRepository userLanguageRepository,
                          LanguageRepository languageRepository,
                          com.migrantcommunity.profile.repository.UserInterestRepository userInterestRepository,
                          CurrentUserProvider currentUserProvider) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.userLanguageRepository = userLanguageRepository;
        this.languageRepository = languageRepository;
        this.userInterestRepository = userInterestRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public ProfileResponse currentProfile() {
        Profile profile = getOrCreateProfile(currentUserProvider.requireUser());
        List<String> languages = userLanguageRepository.findByUserId(profile.getUser().getId())
                .stream()
                .map(ul -> ul.getLanguage().getName())
                .toList();
        String hometown = profile.getHometownCity() != null
                ? profile.getHometownCity() + (profile.getHometownCountry() != null
                        ? ", " + profile.getHometownCountry() : "")
                : null;
        return new ProfileResponse(
                String.valueOf(profile.getUser().getId()),
                profile.getBio() != null ? profile.getBio() : "",
                hometown,
                languages);
    }

    @Transactional(readOnly = true)
    public ProfileDetailsResponse getProfileDetails() {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        List<ProfileDetailsResponse.UserLanguageInfo> languages =
                userLanguageRepository.findByUserId(user.getId()).stream()
                        .map(ul -> new ProfileDetailsResponse.UserLanguageInfo(
                                ul.getLanguage().getId(),
                                ul.getLanguage().getCode(),
                                ul.getLanguage().getName(),
                                ul.getProficiencyLevel() != null ? ul.getProficiencyLevel().name() : null,
                                ul.isPrimary()))
                        .toList();
        Double lat = null;
        Double lng = null;
        if (profile.getCurrentLocationLat() != null && profile.getCurrentLocationLng() != null) {
            lat = profile.getCurrentLocationLat();
            lng = profile.getCurrentLocationLng();
        }
        return new ProfileDetailsResponse(
                user.getId(), user.getEmail(),
                profile.getFirstName(), profile.getLastName(),
                profile.getDateOfBirth(), profile.getGender(), profile.getBio(),
                profile.getProfilePictureUrl(),
                profile.getHometownCountry(), profile.getHometownCity(),
                lat, lng, profile.getLocationAccuracyKm(),
                profile.isDiscoveryEnabled(),
                PrivacySettings.fromProfile(profile),
                languages,
                userInterestRepository.findByUserId(user.getId()).stream()
                        .map(UserInterest::getInterest).toList(),
                profile.getCreatedAt(), profile.getUpdatedAt());
    }

    public ProfileDetailsResponse updateProfile(ProfileUpdateRequest request) {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        if (request.firstName() != null) profile.setFirstName(request.firstName());
        if (request.lastName() != null) profile.setLastName(request.lastName());
        if (request.dateOfBirth() != null) profile.setDateOfBirth(request.dateOfBirth());
        if (request.gender() != null) profile.setGender(request.gender());
        if (request.bio() != null) profile.setBio(request.bio());
        if (request.hometownCountry() != null) profile.setHometownCountry(request.hometownCountry());
        if (request.hometownCity() != null) profile.setHometownCity(request.hometownCity());
        profileRepository.save(profile);
        return getProfileDetails();
    }

    public ProfileDetailsResponse updatePrivacySettings(PrivacySettingsRequest request) {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        PrivacySettings settings = new PrivacySettings(
                request.showHometown(), request.showCurrentCity(), request.showExactLocation(),
                request.allowConnectionRequests(), request.allowDirectMessages(),
                request.showOnlineStatus(), request.discoverable());
        profile.setPrivacySettings(settings.toJson());
        profile.setDiscoveryEnabled(request.discoverable());
        profileRepository.save(profile);
        return getProfileDetails();
    }

    public ProfileDetailsResponse updateLocation(LocationUpdateRequest request) {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        profile.setCurrentLocationLat(request.latitude());
        profile.setCurrentLocationLng(request.longitude());
        if (request.accuracyKm() != null) {
            profile.setLocationAccuracyKm(request.accuracyKm());
        }
        if (request.city() != null) {
            profile.setCurrentCity(request.city());
        }
        profileRepository.save(profile);
        return getProfileDetails();
    }

    public void updateProfilePicture(String imageUrl) {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        profile.setProfilePictureUrl(imageUrl);
        profileRepository.save(profile);
    }

    public void addLanguage(Long languageId, String proficiency, boolean primary) {
        User user = currentUserProvider.requireUser();
        Language language = languageRepository.findById(languageId)
                .orElseThrow(() -> new ResourceNotFoundException("Language", "id", languageId));
        if (userLanguageRepository.existsByUserIdAndLanguageId(user.getId(), languageId)) {
            throw new BadRequestException("Language already added");
        }
        UserLanguage ul = new UserLanguage();
        ul.setUser(user);
        ul.setLanguage(language);
        if (proficiency != null) {
            try {
                ul.setProficiencyLevel(
                        com.migrantcommunity.common.enums.ProficiencyLevel.valueOf(proficiency.toUpperCase()));
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid proficiency level: " + proficiency);
            }
        }
        ul.setPrimary(primary);
        if (primary) {
            userLanguageRepository.findByUserId(user.getId()).stream()
                    .filter(existing -> existing.isPrimary())
                    .forEach(existing -> {
                        existing.setPrimary(false);
                        userLanguageRepository.save(existing);
                    });
        }
        userLanguageRepository.save(ul);
    }

    public void removeLanguage(Long languageId) {
        User user = currentUserProvider.requireUser();
        userLanguageRepository.deleteByUserIdAndLanguageId(user.getId(), languageId);
    }

    public void deactivateAccount() {
        User user = currentUserProvider.requireUser();
        user.setActive(false);
        userRepository.save(user);
    }

    public void addInterest(String interest) {
        User user = currentUserProvider.requireUser();
        Profile profile = getOrCreateProfile(user);
        // Check if interest already exists
        if (userInterestRepository.existsByUserIdAndInterest(user.getId(), interest)) {
            throw new BadRequestException("Interest already added to profile");
        }
        // Create interest
        UserInterest userInterest = new UserInterest(user, interest);
        userInterestRepository.save(userInterest);
    }

    public void removeInterest(String interest) {
        User user = currentUserProvider.requireUser();
        userInterestRepository.deleteByUserIdAndInterest(user.getId(), interest);
    }

    private Profile getOrCreateProfile(User user) {
        return profileRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {
                    Profile p = new Profile(user);
                    return profileRepository.save(p);
                });
    }
}
