package com.migrantcommunity.admin.dto;

import com.migrantcommunity.common.enums.AdminRole;
import com.migrantcommunity.common.enums.AdminStatus;

public record Administrator(
        String id,
        String name,
        String email,
        AdminRole role,
        AdminStatus status,
        String avatarUrl,
        String lastLoginAt,
        String createdAt
) {}