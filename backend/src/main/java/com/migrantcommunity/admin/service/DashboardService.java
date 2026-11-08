package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.*;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import com.migrantcommunity.messaging.repository.MessageRepository;
import com.migrantcommunity.moderation.repository.ReportRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final ConnectionRepository connectionRepository;
    private final PostRepository postRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;
    private final com.migrantcommunity.profile.repository.ProfileRepository profileRepository;
    private final com.migrantcommunity.audit.repository.AuditLogRepository auditLogRepository;

    public DashboardService(UserRepository userRepository, CommunityRepository communityRepository,
                            ConnectionRepository connectionRepository, PostRepository postRepository,
                            MessageRepository messageRepository, ReportRepository reportRepository,
                            com.migrantcommunity.profile.repository.ProfileRepository profileRepository,
                            com.migrantcommunity.audit.repository.AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.connectionRepository = connectionRepository;
        this.postRepository = postRepository;
        this.messageRepository = messageRepository;
        this.reportRepository = reportRepository;
        this.profileRepository = profileRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public DashboardStatistics getStatistics() {
        Instant now = Instant.now();
        return new DashboardStatistics(
                userRepository.count(),
                userRepository.countByActive(true),
                userRepository.countByCreatedAtAfter(now.minus(1, ChronoUnit.DAYS)),
                userRepository.countByCreatedAtAfter(now.minus(7, ChronoUnit.DAYS)),
                communityRepository.count(),
                communityRepository.count(),
                connectionRepository.count(),
                reportRepository.countByStatus(ReportStatus.PENDING),
                reportRepository.countByStatus(ReportStatus.UNDER_REVIEW),
                postRepository.count(),
                messageRepository.count());
    }

    public DashboardOverview getOverview() {
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        List<TimeSeriesPoint> growth = userRepository.countRegistrationsSince(weekAgo).stream()
                .map(row -> new TimeSeriesPoint(String.valueOf(row[0]), ((Number) row[1]).longValue(), 0, 0, 0))
                .toList();

        List<Object[]> langRows = userRepository.countUsersByLanguage();
        long langTotal = langRows.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        List<LanguageDistribution> langs = langRows.stream()
                .map(r -> new LanguageDistribution(String.valueOf(r[0]), ((Number) r[1]).longValue(),
                        langTotal == 0 ? 0 : ((Number) r[1]).doubleValue() / langTotal * 100))
                .toList();

        List<CityDistribution> cities = profileRepository.countUsersByCity().stream()
                .map(r -> new CityDistribution(String.valueOf(r[0]), ((Number) r[1]).longValue(), 0))
                .toList();

        List<ActivityItem> activity = auditLogRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(log -> new ActivityItem(
                        String.valueOf(log.getId()),
                        log.getAction(),
                        log.getDetails() != null ? log.getDetails() : log.getAction(),
                        log.getAdmin() != null
                                ? ((log.getAdmin().getFirstName() != null ? log.getAdmin().getFirstName() : "")
                                   + (log.getAdmin().getLastName() != null ? " " + log.getAdmin().getLastName() : "")).trim()
                                : "System",
                        log.getCreatedAt() != null ? log.getCreatedAt().toString() : null))
                .toList();
        List<com.migrantcommunity.moderation.dto.Report> pending = reportRepository
                .findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING,
                        org.springframework.data.domain.PageRequest.of(0, 10))
                .getContent().stream()
                .map(r -> new com.migrantcommunity.moderation.dto.Report(
                        String.valueOf(r.getId()),
                        r.getTargetType(),
                        r.getTargetId() != null ? String.valueOf(r.getTargetId()) : null,
                        r.getTargetPreview(),
                        r.getReporter() != null ? String.valueOf(r.getReporter().getId()) : null,
                        r.getReporter() != null ? r.getReporter().getEmail() : "Unknown",
                        r.getCategory(),
                        r.getDescription(),
                        r.getStatus(),
                        r.getPriority(),
                        null,
                        r.getCreatedAt() != null ? r.getCreatedAt().toString() : null,
                        null,
                        null))
                .toList();
        return new DashboardOverview(getStatistics(), growth, langs, cities, activity, pending);
    }
}
