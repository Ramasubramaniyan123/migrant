package com.migrantcommunity.language.service;

import com.migrantcommunity.language.dto.LanguageResponse;
import com.migrantcommunity.language.entity.Language;
import com.migrantcommunity.language.repository.LanguageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LanguageService {

    private final LanguageRepository languageRepository;

    public LanguageService(LanguageRepository languageRepository) {
        this.languageRepository = languageRepository;
    }

    public List<LanguageResponse> allLanguages() {
        return languageRepository.findAll().stream()
                .map(l -> new LanguageResponse(l.getCode(), l.getName(), l.getNativeName()))
                .toList();
    }
}
