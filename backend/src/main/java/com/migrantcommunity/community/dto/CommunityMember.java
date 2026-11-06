package com.migrantcommunity.community.dto;

public record CommunityMember(
        String id,
        String communityId,
        String userId,
        String userName,
        String role,
        String joinedAt
) {}