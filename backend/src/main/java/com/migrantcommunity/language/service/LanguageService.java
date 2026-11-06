package com.migrantcommunity.language.service;

import com.migrantcommunity.language.dto.LanguageResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder language reference-data logic for the prototype. */
@Service
public class LanguageService {

    /**
     * Returns placeholder reference data.
     * The real implementation will read the languages table from the database.
     */
    public List<LanguageResponse> allLanguages() {
        return List.of(
                new LanguageResponse("en", "English", "English"),
                new LanguageResponse("hi", "Hindi", "हिन्दी"),
                new LanguageResponse("ta", "Tamil", "தமிழ்"));
    }
}
