package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.CityDistribution;
import com.migrantcommunity.admin.dto.EngagementMetrics;
import com.migrantcommunity.admin.dto.LanguageDistribution;
import com.migrantcommunity.admin.dto.TimeSeriesPoint;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.security.UserSessionRepository;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final PostRepository postRepository;
    private final ConnectionRepository connectionRepository;
    private final ProfileRepository profileRepository;

    public AdminAnalyticsService(UserRepository userRepository,
                                 UserSessionRepository userSessionRepository,
                                 PostRepository postRepository,
                                 ConnectionRepository connectionRepository,
                                 ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.postRepository = postRepository;
        this.connectionRepository = connectionRepository;
        this.profileRepository = profileRepository;
    }

    public List<TimeSeriesPoint> userGrowth() {
        List<TimeSeriesPoint> points = new ArrayList<>();
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        for (int i = 13; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            Instant start = day.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = day.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
            points.add(new TimeSeriesPoint(
                    day.toString(),
                    userRepository.countByCreatedAtBetween(start, end),
                    userSessionRepository.countActiveUsersSince(start) > 0
                            ? userSessionRepository.countActiveUsersSince(start) : 0,
                    postRepository.countByCreatedAtBetween(start, end),
                    connectionRepository.countByCreatedAtBetween(start, end)));
        }
        return points;
    }

    public List<LanguageDistribution> languages() {
        List<Object[]> rows = userRepository.countUsersByLanguage();
        long total = rows.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        return rows.stream()
                .map(r -> new LanguageDistribution(String.valueOf(r[0]), ((Number) r[1]).longValue(),
                        total == 0 ? 0 : ((Number) r[1]).doubleValue() / total * 100))
                .toList();
    }

    public List<CityDistribution> locations() {
        List<Object[]> rows = profileRepository.countUsersByCity();
        long total = rows.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        return rows.stream()
                .map(r -> new CityDistribution(String.valueOf(r[0]), ((Number) r[1]).longValue(),
                        total == 0 ? 0 : ((Number) r[1]).doubleValue() / total * 100))
                .toList();
    }

    public EngagementMetrics engagement() {
        Instant now = Instant.now();
        long users = Math.max(1, userRepository.count());
        long dau = userSessionRepository.countActiveUsersSince(now.minus(1, java.time.temporal.ChronoUnit.DAYS));
        long wau = userSessionRepository.countActiveUsersSince(now.minus(7, java.time.temporal.ChronoUnit.DAYS));
        long mau = userSessionRepository.countActiveUsersSince(now.minus(30, java.time.temporal.ChronoUnit.DAYS));
        double retention7 = retention(now, 7);
        double retention30 = retention(now, 30);
        return new EngagementMetrics(
                dau, wau, mau,
                round1((double) postRepository.count() / users),
                round1((double) connectionRepository.count() / users),
                retention7, retention30);
    }

    private double retention(Instant now, int days) {
        Instant registeredBefore = now.minus(days + 7L, java.time.temporal.ChronoUnit.DAYS);
        Instant activeSince = now.minus(days, java.time.temporal.ChronoUnit.DAYS);
        long cohort = userSessionRepository.countUsersRegisteredBefore(registeredBefore);
        if (cohort == 0) return 0;
        return round1(userSessionRepository.countRetainedUsers(registeredBefore, activeSince) * 100.0 / cohort);
    }

    private static double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
