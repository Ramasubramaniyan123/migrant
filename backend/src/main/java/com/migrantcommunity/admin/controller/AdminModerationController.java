package com.migrantcommunity.admin.controller;

import com.migrantcommunity.moderation.dto.ModerationAction;
import com.migrantcommunity.moderation.dto.Report;
import com.migrantcommunity.moderation.dto.ReportDetails;
import com.migrantcommunity.moderation.service.AdminModerationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/moderation")
public class AdminModerationController {

    private final AdminModerationService service;
    public AdminModerationController(AdminModerationService service) { this.service = service; }

    @GetMapping("/reports")
    public List<Report> reports(@RequestParam(defaultValue = "ALL") String status,
                               @RequestParam(defaultValue = "ALL") String category) {
        return service.list(status, category);
    }

    @GetMapping("/reports/{id}")
    public ReportDetails report(@PathVariable String id) { return service.getDetails(id); }

    @PatchMapping("/reports/{id}/resolve")
    public Report resolve(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String res = body != null ? body.getOrDefault("resolution", "Resolved") : "Resolved";
        return service.resolve(id, res);
    }

    @PatchMapping("/reports/{id}/dismiss")
    public Report dismiss(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.getOrDefault("reason", "Dismissed") : "Dismissed";
        return service.dismiss(id, reason);
    }

    @GetMapping("/history")
    public List<ModerationAction> history() { return service.getHistory(); }
}
