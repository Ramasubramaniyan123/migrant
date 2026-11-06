package com.migrantcommunity.language.controller;

import com.migrantcommunity.language.dto.LanguageResponse;
import com.migrantcommunity.language.service.LanguageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** REST entry point for language reference-data endpoints. */
@RestController
@RequestMapping("/api/language")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    @GetMapping("/list")
    public List<LanguageResponse> listLanguages() {
        return languageService.allLanguages();
    }
}
