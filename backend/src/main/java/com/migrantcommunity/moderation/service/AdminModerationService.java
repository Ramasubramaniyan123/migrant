package com.migrantcommunity.moderation.service;

import com.migrantcommunity.admin.entity.Administrator;
import com.migrantcommunity.admin.repository.AdministratorRepository;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;
import com.migrantcommunity.moderation.dto.ModerationAction;
import com.migrantcommunity.moderation.dto.Report;
import com.migrantcommunity.moderation.dto.ReportDetails;
import com.migrantcommunity.moderation.dto.ReporterHistory;
import com.migrantcommunity.moderation.repository.ModerationActionRepository;
import com.migrantcommunity.moderation.repository.ReportRepository;
import com.migrantcommunity.post.entity.Comment;
import com.migrantcommunity.post.entity.Post;
import com.migrantcommunity.post.repository.CommentRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AdminModerationService {

    private final ReportRepository reportRepository;
    private final ModerationActionRepository actionRepository;
    private final AdministratorRepository administratorRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public AdminModerationService(ReportRepository reportRepository,
                                  ModerationActionRepository actionRepository,
                                  AdministratorRepository administratorRepository,
                                  UserRepository userRepository,
                                  PostRepository postRepository,
                                  CommentRepository commentRepository) {
        this.reportRepository = reportRepository;
        this.actionRepository = actionRepository;
        this.administratorRepository = administratorRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public List<Report> list(String status, String category) {
        ReportStatus statusFilter = (status == null || "ALL".equals(status) || status.isBlank())
                ? null : ReportStatus.valueOf(status);
        com.migrantcommunity.common.enums.ReportCategory categoryFilter =
                (category == null || "ALL".equals(category) || category.isBlank())
                        ? null : com.migrantcommunity.common.enums.ReportCategory.valueOf(category);

        List<com.migrantcommunity.moderation.entity.Report> rows;
        if (statusFilter != null && categoryFilter != null) {
            rows = reportRepository.findAll().stream()
                    .filter(r -> r.getStatus() == statusFilter && r.getCategory() == categoryFilter)
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).toList();
        } else if (statusFilter != null) {
            rows = reportRepository.findByStatusOrderByCreatedAtDesc(statusFilter, Pageable.unpaged())
                    .getContent();
        } else if (categoryFilter != null) {
            rows = reportRepository.findAll().stream()
                    .filter(r -> r.getCategory() == categoryFilter)
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).toList();
        } else {
            rows = reportRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).toList();
        }
        return rows.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Report getById(String id) {
        return toDto(getEntity(id));
    }

    @Transactional(readOnly = true)
    public ReportDetails getDetails(String id) {
        com.migrantcommunity.moderation.entity.Report r = getEntity(id);
        Report base = toDto(r);
        String targetContent = resolveTargetContent(r);
        long totalReports = reportRepository.countByReporterId(r.getReporter() != null ? r.getReporter().getId() : -1L);
        long priorResolved = reportRepository.findAll().stream()
                .filter(x -> x.getReporter() != null && r.getReporter() != null
                        && x.getReporter().getId().equals(r.getReporter().getId())
                        && x.getStatus() == ReportStatus.RESOLVED && !x.getId().equals(r.getId()))
                .count();
        return new ReportDetails(base.id(), base.targetType(), base.targetId(), base.targetPreview(),
                base.reporterId(), base.reporterName(), base.category(), base.description(), base.status(),
                base.priority(), base.assignedTo(), base.createdAt(), base.resolvedAt(), base.resolution(),
                targetContent, new ReporterHistory(totalReports, priorResolved));
    }

    public Report resolve(String id, String resolution) {
        com.migrantcommunity.moderation.entity.Report r = getEntity(id);
        r.setStatus(ReportStatus.RESOLVED);
        r.setResolution(resolution);
        r.setReviewedAt(Instant.now());
        com.migrantcommunity.moderation.entity.Report saved = reportRepository.save(r);
        recordAction("RESOLVE_REPORT", saved, "REMOVE_CONTENT", resolution);
        return toDto(saved);
    }

    public Report dismiss(String id, String reason) {
        com.migrantcommunity.moderation.entity.Report r = getEntity(id);
        r.setStatus(ReportStatus.DISMISSED);
        r.setResolution(reason);
        r.setReviewedAt(Instant.now());
        com.migrantcommunity.moderation.entity.Report saved = reportRepository.save(r);
        recordAction("DISMISS_REPORT", saved, "DISMISS", reason);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ModerationAction> getHistory() {
        return actionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toActionDto).toList();
    }

    private void recordAction(String action, com.migrantcommunity.moderation.entity.Report report,
                              String targetAction, String reason) {
        com.migrantcommunity.moderation.entity.ModerationAction ma = new com.migrantcommunity.moderation.entity.ModerationAction();
        ma.setReport(report);
        ma.setModerator(currentAdministrator());
        ma.setAction(action);
        ma.setTargetType(report.getTargetType() != null ? report.getTargetType().name() : null);
        ma.setTargetId(report.getTargetId());
        ma.setReason(reason);
        actionRepository.save(ma);
    }

    private Administrator currentAdministrator() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return administratorRepository.findByEmail(auth.getName()).orElse(null);
    }

    private com.migrantcommunity.moderation.entity.Report getEntity(String id) {
        return reportRepository.findById(parseId(id))
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Report not found");
        }
    }

    private String resolveTargetContent(com.migrantcommunity.moderation.entity.Report r) {
        if (r.getTargetType() == null || r.getTargetId() == null) return null;
        return switch (r.getTargetType()) {
            case POST -> postRepository.findById(r.getTargetId())
                    .map(Post::getContent).orElse(null);
            case COMMENT -> commentRepository.findById(r.getTargetId())
                    .map(Comment::getContent).orElse(null);
            case USER -> userRepository.findById(r.getTargetId())
                    .map(User::getEmail).orElse(null);
            case COMMUNITY -> null;
            case MESSAGE -> null;
        };
    }

    private String targetPreview(com.migrantcommunity.moderation.entity.Report r) {
        if (r.getTargetPreview() != null && !r.getTargetPreview().isBlank()) {
            return r.getTargetPreview();
        }
        String content = resolveTargetContent(r);
        if (content != null) {
            return content.length() > 200 ? content.substring(0, 200) : content;
        }
        return r.getTargetType() != null && r.getTargetId() != null
                ? r.getTargetType() + " #" + r.getTargetId() : null;
    }

    private Report toDto(com.migrantcommunity.moderation.entity.Report r) {
        User reporter = r.getReporter();
        Profile profile = reporter != null ? reporter.getProfile() : null;
        String reporterName = profile != null && profile.getFirstName() != null
                ? profile.getFirstName() + (profile.getLastName() != null ? " " + profile.getLastName() : "")
                : (reporter != null ? reporter.getEmail() : "Unknown");
        return new Report(
                String.valueOf(r.getId()),
                r.getTargetType(),
                r.getTargetId() != null ? String.valueOf(r.getTargetId()) : null,
                targetPreview(r),
                reporter != null ? String.valueOf(reporter.getId()) : null,
                reporterName,
                r.getCategory(),
                r.getDescription() != null ? r.getDescription() : r.getReason(),
                r.getStatus(),
                r.getPriority(),
                null,
                r.getCreatedAt() != null ? r.getCreatedAt().toString() : null,
                r.getReviewedAt() != null ? r.getReviewedAt().toString() : null,
                r.getResolution());
    }

    private ModerationAction toActionDto(com.migrantcommunity.moderation.entity.ModerationAction a) {
        Administrator mod = a.getModerator();
        String modName = mod != null
                ? ((mod.getFirstName() != null ? mod.getFirstName() : "")
                   + (mod.getLastName() != null ? " " + mod.getLastName() : "")).trim()
                : "System";
        ReportTargetType targetType = null;
        try {
            targetType = a.getTargetType() != null ? ReportTargetType.valueOf(a.getTargetType()) : null;
        } catch (IllegalArgumentException ignored) {
        }
        return new ModerationAction(
                String.valueOf(a.getId()),
                a.getReport() != null ? String.valueOf(a.getReport().getId()) : null,
                mod != null ? String.valueOf(mod.getId()) : null,
                modName,
                a.getAction(),
                targetType,
                a.getTargetId() != null ? String.valueOf(a.getTargetId()) : null,
                a.getReason(),
                a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
    }
}
