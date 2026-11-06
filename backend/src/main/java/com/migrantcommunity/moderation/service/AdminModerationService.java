package com.migrantcommunity.moderation.service;

import com.migrantcommunity.common.enums.ReportCategory;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;
import com.migrantcommunity.moderation.dto.ModerationAction;
import com.migrantcommunity.moderation.dto.Report;
import com.migrantcommunity.moderation.dto.ReportDetails;
import com.migrantcommunity.moderation.dto.ReporterHistory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminModerationService {
    private final List<Report> reports = new ArrayList<>();
    private final List<ModerationAction> actions = new ArrayList<>();

    public AdminModerationService() { seed(); }
    private void seed() {
        reports.add(new Report("rep_1", ReportTargetType.POST, "post_1", "Offensive language in post", "usr_10", "Ravi Kumar", ReportCategory.HATE_SPEECH, "Contains hate speech", ReportStatus.PENDING, "HIGH", null, "2025-01-01T07:00:00Z", null, null));
        reports.add(new Report("rep_2", ReportTargetType.USER, "usr_20", "Fake profile suspected", "usr_11", "Anita Das", ReportCategory.FAKE_PROFILE, "Profile looks fake", ReportStatus.UNDER_REVIEW, "MEDIUM", "adm_003", "2025-01-01T06:00:00Z", null, null));
        reports.add(new Report("rep_3", ReportTargetType.COMMENT, "cmt_5", "Spam comment", "usr_12", "Suresh", ReportCategory.SPAM, "Spam link", ReportStatus.RESOLVED, "LOW", "adm_003", "2024-12-30T06:00:00Z", "2024-12-31T06:00:00Z", "Removed comment"));
    }

    public List<Report> list(String status, String category) {
        List<Report> items = new ArrayList<>(reports);
        if (status != null && !"ALL".equals(status)) items = items.stream().filter(r -> r.status().name().equals(status)).collect(Collectors.toList());
        if (category != null && !"ALL".equals(category)) items = items.stream().filter(r -> r.category().name().equals(category)).collect(Collectors.toList());
        return items;
    }

    public Report getById(String id) { return reports.stream().filter(r -> r.id().equals(id)).findFirst().orElseThrow(() -> new IllegalArgumentException("Report not found")); }

    public ReportDetails getDetails(String id) {
        Report r = getById(id);
        return new ReportDetails(r.id(), r.targetType(), r.targetId(), r.targetPreview(), r.reporterId(), r.reporterName(), r.category(), r.description(), r.status(), r.priority(), r.assignedTo(), r.createdAt(), r.resolvedAt(), r.resolution(), "Target content placeholder", new ReporterHistory(3, 1));
    }

    public Report resolve(String id, String resolution) {
        Report r = getById(id);
        Report u = new Report(r.id(), r.targetType(), r.targetId(), r.targetPreview(), r.reporterId(), r.reporterName(), r.category(), r.description(), ReportStatus.RESOLVED, r.priority(), r.assignedTo(), r.createdAt(), java.time.Instant.now().toString(), resolution);
        replace(u);
        recordAction("RESOLVE", r, "adm_003", "Moderator", resolution);
        return u;
    }

    public Report dismiss(String id, String reason) {
        Report r = getById(id);
        Report u = new Report(r.id(), r.targetType(), r.targetId(), r.targetPreview(), r.reporterId(), r.reporterName(), r.category(), r.description(), ReportStatus.DISMISSED, r.priority(), r.assignedTo(), r.createdAt(), java.time.Instant.now().toString(), reason);
        replace(u);
        recordAction("DISMISS", r, "adm_003", "Moderator", reason);
        return u;
    }

    public List<ModerationAction> getHistory() { return new ArrayList<>(actions); }

    private void recordAction(String action, Report r, String adminId, String adminName, String reason) {
        actions.add(new ModerationAction("ma_" + (actions.size() + 1), r.id(), adminId, adminName, action.equals("RESOLVE") ? "REMOVE_CONTENT" : "DISMISS", r.targetType(), r.targetId(), reason, java.time.Instant.now().toString()));
    }

    private void replace(Report r) { for (int i = 0; i < reports.size(); i++) if (reports.get(i).id().equals(r.id())) { reports.set(i, r); break; } }
}
