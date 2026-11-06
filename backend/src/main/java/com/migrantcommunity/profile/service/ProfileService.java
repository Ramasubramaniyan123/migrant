package com.migrantcommunity.profile.service;

import com.migrantcommunity.profile.dto.ProfileResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder profile logic for the prototype. */
@Service
public class ProfileService {

    /**
     * Returns a placeholder profile.
     * The real implementation will join the user, profile and language tables
     * in the database.
     */
    public ProfileResponse currentProfile() {
        return new ProfileResponse(
                "usr_001",
                "New to the city and looking to meet people from home.",
                "Mumbai",
                List.of("English", "Hindi"));
    }
}
