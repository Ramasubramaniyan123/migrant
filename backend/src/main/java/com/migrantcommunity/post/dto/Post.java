package com.migrantcommunity.post.dto;

public record Post(
        String id,
        String authorId,
        String authorName,
        String communityId,
        String communityName,
        String content,
        String imageUrl,
        long likeCount,
        long commentCount,
        boolean isFlagged,
        String createdAt
) {}