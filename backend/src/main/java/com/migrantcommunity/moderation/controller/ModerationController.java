package com.migrantcommunity.moderation.controller;

import com.migrantcommunity.common.enums.ReportCategory;
import com.migrantcommunity.common.enums.ReportTargetType;
import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.moderation.entity.Report;
import com.migrantcommunity.moderation.service.ModerationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** User-facing report submission and status endpoints. */
@RestController
@RequestMapping("/v1/moderation")
@Tag(name = "Moderation", description = "User reporting")
public class ModerationController {

    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @PostMapping("/reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submit(@RequestBody Map<String, Object> body) {
        ReportTargetType targetType = ReportTargetType.valueOf(String.valueOf(body.get("targetType")).toUpperCase());
        Long targetId = ((Number) body.get("targetId")).longValue();
        ReportCategory category = body.get("category") != null
                ? ReportCategory.valueOf(String.valueOf(body.get("category")).toUpperCase())
                : null;
        Report report = moderationService.submit(
                targetType, targetId, category,
                (String) body.get("reason"), (String) body.get("description"));
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("reportId", report.getId(), "status", report.getStatus().name()),
                "Report submitted"));
    }

    @GetMapping("/reports/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<Map<String, Object>>>> myReports(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Report> page = moderationService.myReports(pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent().stream().map(this::toMap).toList(),
                        page.getNumber(), page.getSize(), page.getTotalElements()),
                "Reports retrieved"));
    }

    @GetMapping("/reports/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reportStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(toMap(moderationService.get(id)), "Report retrieved"));
    }

    private Map<String, Object> toMap(Report r) {
        return Map.of(
                "id", r.getId(),
                "targetType", r.getTargetType() != null ? r.getTargetType().name() : "",
                "targetId", r.getTargetId() != null ? r.getTargetId() : 0,
                "category", r.getCategory() != null ? r.getCategory().name() : "",
                "reason", r.getReason() != null ? r.getReason() : "",
                "status", r.getStatus().name(),
                "createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : "");
    }
}
