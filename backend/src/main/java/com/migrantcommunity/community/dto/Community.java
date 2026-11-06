package com.migrantcommunity.community.dto;

import com.migrantcommunity.common.enums.CommunityType;

public record Community(
        String id,
        String name,
        String description,
        CommunityType type,
        String language,
        String hometown,
        String city,
        long memberCount,
        long postCount,
        boolean isActive,
        String createdBy,
        String createdAt
) {}