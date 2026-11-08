package com.migrantcommunity.post.dto;

import java.time.Instant;

public record CommentResponse(
        Long id,
        Long postId,
        Long parentCommentId,
        Long authorId,
        String authorName,
        String content,
        Instant createdAt) {
}
