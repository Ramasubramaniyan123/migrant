package com.migrantcommunity.post.dto;

import java.time.Instant;
import java.util.List;

public record PostDetailsResponse(
        Long id,
        Long communityId,
        String communityName,
        Long authorId,
        String authorName,
        String authorAvatarUrl,
        String content,
        String imageUrl,
        List<String> imageUrls,
        int likeCount,
        int commentCount,
        boolean likedByMe,
        Instant createdAt,
        Instant updatedAt) {
}
