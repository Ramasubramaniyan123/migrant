package com.migrantcommunity.community.dto;

import java.time.Instant;

/** Detailed community view. */
public record CommunityDetailsResponse(
        Long id,
        String name,
        String description,
        Long languageId,
        String languageName,
        String locationCountry,
        String locationCity,
        boolean publicCommunity,
        int memberCount,
        boolean member,
        String memberRole,
        Instant createdAt) {

    public record MemberInfo(Long userId, String displayName, String role, Instant joinedAt) {
    }

    public record InvitationInfo(Long id, Long communityId, String inviterName,
                                 Long inviteeId, String inviteeEmail, String status) {
    }
}
