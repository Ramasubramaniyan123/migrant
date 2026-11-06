package com.migrantcommunity.moderation.controller;

import com.migrantcommunity.moderation.dto.ModerationResponse;
import com.migrantcommunity.moderation.service.ModerationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** REST entry point for moderation endpoints. */
@RestController
@RequestMapping("/api/moderation")
public class ModerationController {

    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @GetMapping("/reports")
    public List<ModerationResponse> listReports() {
        return moderationService.reports();
    }
}
