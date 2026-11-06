package com.migrantcommunity.post.dto;

/** A post published inside a community. */
public record PostResponse(String id, String authorId, String communityId, String content, int likeCount) {
}
