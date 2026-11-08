package com.migrantcommunity.language.service;

import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.language.dto.Language;
import com.migrantcommunity.language.repository.LanguageRepository;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class AdminLanguageService {

    private final LanguageRepository languageRepository;
    private final UserLanguageRepository userLanguageRepository;
    private final CommunityRepository communityRepository;

    public AdminLanguageService(LanguageRepository languageRepository,
                                UserLanguageRepository userLanguageRepository,
                                CommunityRepository communityRepository) {
        this.languageRepository = languageRepository;
        this.userLanguageRepository = userLanguageRepository;
        this.communityRepository = communityRepository;
    }

    @Transactional(readOnly = true)
    public List<Language> list() {
        return languageRepository.findAll().stream().map(this::toDto).toList();
    }

    public Language create(String name, String nativeName, String code) {
        String c = code == null ? "" : code.trim().toLowerCase(Locale.ROOT);
        if (c.isEmpty()) {
            throw new IllegalArgumentException("Language code is required");
        }
        if (languageRepository.existsByCode(c)) {
            throw new IllegalArgumentException("A language with this code already exists");
        }
        com.migrantcommunity.language.entity.Language entity = new com.migrantcommunity.language.entity.Language();
        entity.setName(name.trim());
        entity.setNativeName(nativeName == null ? null : nativeName.trim());
        entity.setCode(c);
        entity.setActive(true);
        return toDto(languageRepository.save(entity));
    }

    public Language update(String id, String name, String nativeName, String code, Boolean isActive) {
        com.migrantcommunity.language.entity.Language entity = getEntity(id);
        if (name != null) entity.setName(name.trim());
        if (nativeName != null) entity.setNativeName(nativeName.trim());
        if (code != null) {
            String c = code.trim().toLowerCase(Locale.ROOT);
            if (!c.equals(entity.getCode()) && languageRepository.existsByCode(c)) {
                throw new IllegalArgumentException("A language with this code already exists");
            }
            entity.setCode(c);
        }
        if (isActive != null) entity.setActive(isActive);
        return toDto(languageRepository.save(entity));
    }

    public Language setActive(String id, boolean isActive) {
        return update(id, null, null, null, isActive);
    }

    @Transactional(readOnly = true)
    public Language getById(String id) {
        return toDto(getEntity(id));
    }

    public static record LangStats(long total, long active, long totalUsers) {}

    @Transactional(readOnly = true)
    public LangStats getStats() {
        List<com.migrantcommunity.language.entity.Language> all = languageRepository.findAll();
        long totalUsers = all.stream().mapToLong(l -> userLanguageRepository.countByLanguageId(l.getId())).sum();
        return new LangStats(all.size(),
                all.stream().filter(com.migrantcommunity.language.entity.Language::isActive).count(), totalUsers);
    }

    private com.migrantcommunity.language.entity.Language getEntity(String id) {
        return languageRepository.findById(parseId(id))
                .orElseThrow(() -> new IllegalArgumentException("Language not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Language not found");
        }
    }

    private Language toDto(com.migrantcommunity.language.entity.Language l) {
        return new Language(
                String.valueOf(l.getId()),
                l.getName(),
                l.getNativeName(),
                l.getCode(),
                l.isActive(),
                userLanguageRepository.countByLanguageId(l.getId()),
                communityRepository.countByLanguageId(l.getId()));
    }
}
