package com.migrantcommunity.user.service;

import com.migrantcommunity.common.enums.UserStatus;
import com.migrantcommunity.user.dto.PlatformUser;
import com.migrantcommunity.user.dto.UserActivityEntry;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final List<PlatformUser> users = new ArrayList<>();
    private final List<UserActivityEntry> activity = new ArrayList<>();

    public AdminUserService() { seed(); }

    private void seed() {
        String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Pune", "Chennai"};
        String[] langs = {"Hindi", "Tamil", "Telugu", "Bengali", "Marathi"};
        String[] hometowns = {"Lucknow", "Chennai", "Hyderabad", "Kolkata", "Nagpur"};
        for (int i = 1; i <= 40; i++) {
            users.add(new PlatformUser(
                    "usr_" + i,
                    "User " + i,
                    "user" + i + "@example.com",
                    "+91900000" + String.format("%04d", i),
                    null,
                    i % 7 == 0 ? UserStatus.SUSPENDED : (i % 11 == 0 ? UserStatus.PENDING_VERIFICATION : UserStatus.ACTIVE),
                    i % 3 == 0,
                    hometowns[i % hometowns.length],
                    "State" + (i % 5),
                    cities[i % cities.length],
                    "Locality " + (i % 8),
                    langs[i % langs.length],
                    List.of(langs[i % langs.length], "English"),
                    "Engineer",
                    "2024-11-" + String.format("%02d", (i % 28) + 1) + "T10:00:00Z",
                    "2025-01-0" + ((i % 9) + 1) + "T10:00:00Z"
            ));
        }
        for (int i = 1; i <= 40; i++) {
            activity.add(new UserActivityEntry("act_" + i, "usr_" + i, "LOGIN", "User logged in", "2025-01-01T09:00:00Z"));
        }
    }

    public static record UserListResult(List<PlatformUser> items, long total, int page, int pageSize) {}

    public UserListResult list(String search, String status, String city, String language, int page, int pageSize) {
        List<PlatformUser> items = new ArrayList<>(users);
        String q = search == null ? "" : search.trim().toLowerCase();
        if (!q.isEmpty()) {
            items = items.stream().filter(u ->
                    u.fullName().toLowerCase().contains(q) ||
                    u.email().toLowerCase().contains(q) ||
                    u.hometown().toLowerCase().contains(q)).collect(Collectors.toList());
        }
        if (status != null && !"ALL".equals(status)) {
            items = items.stream().filter(u -> u.status().name().equals(status)).collect(Collectors.toList());
        }
        if (city != null && !"ALL".equals(city)) {
            items = items.stream().filter(u -> u.currentCity().equals(city)).collect(Collectors.toList());
        }
        if (language != null && !"ALL".equals(language)) {
            items = items.stream().filter(u -> u.motherTongue().equals(language)).collect(Collectors.toList());
        }
        long total = items.size();
        int start = (page - 1) * pageSize;
        List<PlatformUser> pageItems = items.stream().skip(start).limit(pageSize).collect(Collectors.toList());
        return new UserListResult(pageItems, total, page, pageSize);
    }

    public PlatformUser getById(String id) {
        return users.stream().filter(u -> u.id().equals(id)).findFirst().orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public PlatformUser suspend(String id) { return updateStatus(id, UserStatus.SUSPENDED); }
    public PlatformUser activate(String id) { return updateStatus(id, UserStatus.ACTIVE); }
    public PlatformUser verify(String id) {
        PlatformUser u = getById(id);
        PlatformUser nu = new PlatformUser(u.id(), u.fullName(), u.email(), u.phone(), u.avatarUrl(), u.status(), true, u.hometown(), u.hometownState(), u.currentCity(), u.currentLocality(), u.motherTongue(), u.languages(), u.occupation(), u.joinedAt(), u.lastActiveAt());
        replace(nu); return nu;
    }
    public PlatformUser deactivate(String id) { return updateStatus(id, UserStatus.DEACTIVATED); }

    private PlatformUser updateStatus(String id, UserStatus s) {
        PlatformUser u = getById(id);
        PlatformUser nu = new PlatformUser(u.id(), u.fullName(), u.email(), u.phone(), u.avatarUrl(), s, u.isVerified(), u.hometown(), u.hometownState(), u.currentCity(), u.currentLocality(), u.motherTongue(), u.languages(), u.occupation(), u.joinedAt(), u.lastActiveAt());
        replace(nu); return nu;
    }

    private void replace(PlatformUser u) {
        for (int i = 0; i < users.size(); i++) if (users.get(i).id().equals(u.id())) { users.set(i, u); break; }
    }

    public List<UserActivityEntry> getActivity(String userId) {
        return activity.stream().filter(a -> a.userId().equals(userId)).collect(Collectors.toList());
    }

    public record FilterOptions(List<String> cities, List<String> languages, List<String> statuses) {}

    public FilterOptions getFilterOptions() {
        List<String> cities = users.stream().map(PlatformUser::currentCity).distinct().sorted().collect(Collectors.toList());
        List<String> languages = users.stream().map(PlatformUser::motherTongue).distinct().sorted().collect(Collectors.toList());
        List<String> statuses = List.of("ACTIVE", "SUSPENDED", "PENDING_VERIFICATION", "DEACTIVATED");
        return new FilterOptions(cities, languages, statuses);
    }
}
