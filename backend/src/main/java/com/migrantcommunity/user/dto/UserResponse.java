package com.migrantcommunity.user.dto;

/** Public-safe view of a user account. */
public record UserResponse(String id, String fullName, String email, String hometown) {
}
