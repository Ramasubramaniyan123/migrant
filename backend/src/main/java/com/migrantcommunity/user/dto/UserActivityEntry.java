package com.migrantcommunity.user.dto;

public record UserActivityEntry(
        String id,
        String userId,
        String type,
        String description,
        String createdAt
) {}