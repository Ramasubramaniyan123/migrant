package com.migrantcommunity.user.service;

import com.migrantcommunity.audit.repository.AuditLogRepository;
import com.migrantcommunity.common.enums.UserStatus;
import com.migrantcommunity.language.entity.UserLanguage;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.security.UserSessionRepository;
import com.migrantcommunity.user.dto.PlatformUser;
import com.migrantcommunity.user.dto.UserActivityEntry;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;
    private final com.migrantcommunity.profile.repository.ProfileRepository profileRepository;
    private final UserLanguageRepository userLanguageRepository;
    private final UserSessionRepository userSessionRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminUserService(UserRepository userRepository,
                            com.migrantcommunity.profile.repository.ProfileRepository profileRepository,
                            UserLanguageRepository userLanguageRepository,
                            UserSessionRepository userSessionRepository,
                            AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.userLanguageRepository = userLanguageRepository;
        this.userSessionRepository = userSessionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public static record UserListResult(List<PlatformUser> items, long total, int page, int pageSize) {}

    @Transactional(readOnly = true)
    public UserListResult list(String search, String status, String city, String language, int page, int pageSize) {
        UserStatus statusFilter = (status == null || "ALL".equals(status) || status.isBlank())
                ? null : UserStatus.valueOf(status);
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, pageSize));
        Page<User> result = userRepository.searchForAdmin(
                search == null ? "" : search.trim(), statusFilter,
                city, language, pageable);
        List<PlatformUser> items = result.getContent().stream().map(this::toDto).toList();
        return new UserListResult(items, result.getTotalElements(), page, pageSize);
    }

    @Transactional(readOnly = true)
    public PlatformUser getById(String id) {
        return toDto(getEntity(id));
    }

    public PlatformUser suspend(String id) {
        User user = getEntity(id);
        user.setAccountStatus(UserStatus.SUSPENDED);
        user.setActive(false);
        return toDto(userRepository.save(user));
    }

    public PlatformUser activate(String id) {
        User user = getEntity(id);
        user.setAccountStatus(UserStatus.ACTIVE);
        user.setActive(true);
        return toDto(userRepository.save(user));
    }

    public PlatformUser verify(String id) {
        User user = getEntity(id);
        user.setVerified(true);
        if (user.getAccountStatus() == UserStatus.PENDING_VERIFICATION) {
            user.setAccountStatus(UserStatus.ACTIVE);
        }
        return toDto(userRepository.save(user));
    }

    public PlatformUser deactivate(String id) {
        User user = getEntity(id);
        user.setAccountStatus(UserStatus.DEACTIVATED);
        user.setActive(false);
        return toDto(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserActivityEntry> getActivity(String userId) {
        Long uid = parseId(userId);
        return auditLogRepository.findAll().stream()
                .filter(log -> log.getEntityType() != null && log.getEntityType().equalsIgnoreCase("USER")
                        && log.getEntityId() != null && log.getEntityId().equals(uid))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(log -> new UserActivityEntry(
                        String.valueOf(log.getId()), String.valueOf(uid),
                        log.getAction(), log.getDetails(),
                        log.getCreatedAt() != null ? log.getCreatedAt().toString() : null))
                .toList();
    }

    public record FilterOptions(List<String> cities, List<String> languages, List<String> statuses) {}

    @Transactional(readOnly = true)
    public FilterOptions getFilterOptions() {
        List<String> cities = userRepository.findDistinctCurrentCities();
        List<String> languages = userLanguageRepository.findAll().stream()
                .map(ul -> ul.getLanguage().getName())
                .distinct().sorted().toList();
        List<String> statuses = List.of("ACTIVE", "SUSPENDED", "PENDING_VERIFICATION", "DEACTIVATED");
        return new FilterOptions(cities, languages, statuses);
    }

    private User getEntity(String id) {
        Long uid = parseId(id);
        return userRepository.findById(uid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("User not found");
        }
    }

    private PlatformUser toDto(User user) {
        Profile profile = user.getProfile() != null ? user.getProfile() : profileRepository.findByUserId(user.getId()).orElse(null);
        List<UserLanguage> userLanguages = userLanguageRepository.findByUserId(user.getId());
        String motherTongue = userLanguages.stream()
                .filter(UserLanguage::isPrimary).findFirst()
                .or(() -> userLanguages.stream().findFirst())
                .map(ul -> ul.getLanguage().getName()).orElse(null);
        List<String> languageNames = userLanguages.stream()
                .map(ul -> ul.getLanguage().getName()).distinct().toList();
        Instant lastActive = userSessionRepository.findLastActiveAtByUserId(user.getId());

        String fullName = profile != null
                ? ((profile.getFirstName() != null ? profile.getFirstName() : "")
                   + (profile.getLastName() != null ? " " + profile.getLastName() : "")).trim()
                : "";
        if (fullName.isEmpty()) fullName = user.getEmail();

        UserStatus status = user.getAccountStatus() != null
                ? user.getAccountStatus()
                : (user.isActive() ? (user.isVerified() ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION)
                                   : UserStatus.SUSPENDED);

        return new PlatformUser(
                String.valueOf(user.getId()),
                fullName,
                user.getEmail(),
                null,
                profile != null ? profile.getProfilePictureUrl() : null,
                status,
                user.isVerified(),
                profile != null ? profile.getHometownCity() : null,
                profile != null ? profile.getHometownCountry() : null,
                profile != null ? profile.getCurrentCity() : null,
                null,
                motherTongue,
                languageNames,
                null,
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                lastActive != null ? lastActive.toString() : null);
    }
}
