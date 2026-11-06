package com.migrantcommunity.community.service;

import com.migrantcommunity.community.dto.CommunityResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder community logic for the prototype. */
@Service
public class CommunityService {

    /**
     * Returns placeholder communities.
     * The real implementation will read the communities table from the database.
     */
    public List<CommunityResponse> communities() {
        return List.of(
                new CommunityResponse("com_001", "Mumbai Migrants", "hi", 128),
                new CommunityResponse("com_002", "Tamil Network", "ta", 76));
    }

    /**
     * Returns the placeholder community that was created.
     * The real implementation will persist a new row in the communities table.
     */
    public CommunityResponse create(String name, String languageCode) {
        return new CommunityResponse("com_new", name, languageCode, 1);
    }
}
