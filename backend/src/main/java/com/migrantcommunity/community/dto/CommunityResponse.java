package com.migrantcommunity.community.dto;

/** A language-based community. */
public record CommunityResponse(String id, String name, String languageCode, int memberCount) {
}
