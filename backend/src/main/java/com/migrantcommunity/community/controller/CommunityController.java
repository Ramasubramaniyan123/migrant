package com.migrantcommunity.community.controller;

import com.migrantcommunity.community.dto.CommunityResponse;
import com.migrantcommunity.community.service.CommunityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** REST entry point for community endpoints. */
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/list")
    public List<CommunityResponse> listCommunities() {
        return communityService.communities();
    }

    @PostMapping("/create")
    public CommunityResponse createCommunity(@RequestBody Map<String, String> payload) {
        return communityService.create(payload.get("name"), payload.get("languageCode"));
    }
}
