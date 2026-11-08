package com.migrantcommunity.admin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.migrantcommunity.admin.entity.PlatformSetting;
import com.migrantcommunity.admin.repository.PlatformSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Transactional
public class AdminSettingsService {

    private final PlatformSettingRepository settingsRepository;
    private final ObjectMapper objectMapper;

    public AdminSettingsService(PlatformSettingRepository settingsRepository, ObjectMapper objectMapper) {
        this.settingsRepository = settingsRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> get() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("platformName", "Migrant Community Platform");
        result.put("maintenanceMode", false);
        result.put("allowRegistrations", true);
        for (PlatformSetting setting : settingsRepository.findAll()) {
            result.put(setting.getKey(), parseValue(setting.getValue()));
        }
        return result;
    }

    public Map<String, Object> update(Map<String, Object> patch) {
        for (Map.Entry<String, Object> entry : patch.entrySet()) {
            PlatformSetting setting = settingsRepository.findById(entry.getKey())
                    .orElseGet(() -> new PlatformSetting(entry.getKey(), null));
            try {
                setting.setValue(objectMapper.writeValueAsString(entry.getValue()));
            } catch (Exception e) {
                setting.setValue(String.valueOf(entry.getValue()));
            }
            settingsRepository.save(setting);
        }
        return get();
    }

    private Object parseValue(String value) {
        if (value == null) return null;
        try {
            return objectMapper.readValue(value, Object.class);
        } catch (Exception e) {
            return value;
        }
    }
}
