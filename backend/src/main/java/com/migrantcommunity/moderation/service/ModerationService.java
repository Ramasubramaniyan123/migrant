package com.migrantcommunity.moderation.service;

import com.migrantcommunity.moderation.dto.ModerationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder moderation logic for the prototype. */
@Service
public class ModerationService {

    /**
     * Returns placeholder reports.
     * The real implementation will read the reports table from the database and
     * is restricted to moderators.
     */
    public List<ModerationResponse> reports() {
        return List.of(
                new ModerationResponse("rep_001", "OPEN", "Spam content"),
                new ModerationResponse("rep_002", "RESOLVED", "Harassment reported by a user"));
    }
}
