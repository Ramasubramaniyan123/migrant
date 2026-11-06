package com.migrantcommunity.profile.dto;

import java.util.List;

/** Profile details shown on a user's own profile page. */
public record ProfileResponse(String userId, String bio, String hometown, List<String> languages) {
}
