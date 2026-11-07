package com.migrantcommunity.auth.dto;

public record UserSummary(
        Long userId,
        String email,
        String role,
        boolean active,
        boolean verified) {
}
