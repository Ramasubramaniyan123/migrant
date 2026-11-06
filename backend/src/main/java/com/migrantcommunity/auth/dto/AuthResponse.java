package com.migrantcommunity.auth.dto;

/** Response payload describing an authenticated session. */
public record AuthResponse(String token, String userId, String email, String role) {
}
