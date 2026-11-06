package com.migrantcommunity.moderation.dto;

/** A moderation report raised against content or a user. */
public record ModerationResponse(String reportId, String status, String reason) {
}
