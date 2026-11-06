package com.migrantcommunity.user.service;

import com.migrantcommunity.user.dto.UserResponse;
import org.springframework.stereotype.Service;

/** Placeholder user lookup logic for the prototype. */
@Service
public class UserService {

    /**
     * Returns a placeholder user.
     * The real implementation will resolve the authenticated principal and load
     * the matching row from the database.
     */
    public UserResponse currentUser() {
        return new UserResponse("usr_001", "Aarav Sharma", "aarav.sharma@example.com", "Mumbai");
    }
}
