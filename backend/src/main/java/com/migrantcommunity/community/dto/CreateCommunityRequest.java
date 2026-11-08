package com.migrantcommunity.community.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommunityRequest(
        @NotBlank @Size(max = 255) String name,
        @Size(max = 2000) String description,
        Long languageId,
        @Size(max = 100) String locationCountry,
        @Size(max = 100) String locationCity,
        Boolean publicCommunity) {
}
