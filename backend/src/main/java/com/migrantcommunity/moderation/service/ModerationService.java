package com.migrantcommunity.moderation.service;

import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.enums.ReportCategory;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.moderation.entity.Report;
import com.migrantcommunity.moderation.repository.ReportRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ModerationService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    public ModerationService(ReportRepository reportRepository,
                             UserRepository userRepository,
                             NotificationService notificationService,
                             CurrentUserProvider currentUserProvider) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.currentUserProvider = currentUserProvider;
    }

    public Report submit(ReportTargetType targetType, Long targetId, ReportCategory category,
                         String reason, String description) {
        User reporter = currentUserProvider.requireUser();
        if (targetType == null || targetId == null) {
            throw new BadRequestException("targetType and targetId are required");
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setTargetType(targetType);
        report.setTargetId(targetId);
        report.setCategory(category != null ? category : ReportCategory.OTHER);
        report.setReason(reason);
        report.setDescription(description);
        report.setStatus(ReportStatus.PENDING);
        return reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Page<Report> myReports(Pageable pageable) {
        return reportRepository.findByReporterIdOrderByCreatedAtDesc(
                currentUserProvider.requireUserId(), pageable);
    }

    @Transactional(readOnly = true)
    public Report get(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
        Long userId = currentUserProvider.requireUserId();
        boolean isReporter = report.getReporter() != null && report.getReporter().getId().equals(userId);
        // Moderators/admins may view any report — enforced at controller level for admin routes.
        if (!isReporter) {
            throw new ForbiddenException("You can only view your own reports");
        }
        return report;
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
}
