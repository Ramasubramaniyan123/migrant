package com.migrantcommunity.user.dto;

import com.migrantcommunity.common.enums.UserStatus;

public record PlatformUser(
        String id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        UserStatus status,
        boolean isVerified,
        String hometown,
        String hometownState,
        String currentCity,
        String currentLocality,
        String motherTongue,
        java.util.List<String> languages,
        String occupation,
        String joinedAt,
        String lastActiveAt
) {}