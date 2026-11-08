package com.migrantcommunity.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreatePostRequest(
        @NotNull Long communityId,
        @NotBlank @Size(max = 5000) String content,
        String imageUrl,
        List<String> imageUrls) {
}
