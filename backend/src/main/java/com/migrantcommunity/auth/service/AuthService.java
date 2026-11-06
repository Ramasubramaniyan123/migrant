package com.migrantcommunity.auth.service;

import com.migrantcommunity.auth.dto.AuthResponse;
import org.springframework.stereotype.Service;

/** Placeholder authentication logic for the prototype. */
@Service
public class AuthService {

    /**
     * Returns a placeholder session.
     * The real implementation will load the user from the database, verify the
     * stored password hash and issue a signed JWT.
     */
    public AuthResponse currentSession() {
        return new AuthResponse("placeholder-token", "usr_001", "aarav.sharma@example.com", "USER");
    }

    /**
     * Returns a placeholder session for the supplied credentials.
     * The real implementation will validate credentials against the database.
     */
    public AuthResponse login(String email, String password) {
        return new AuthResponse("placeholder-token", "usr_001", email, "USER");
    }
}
