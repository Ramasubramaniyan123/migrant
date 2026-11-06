package com.migrantcommunity.admin.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AdminSettingsService {
    private final Map<String, Object> settings = new LinkedHashMap<>();
    public AdminSettingsService() {
        settings.put("platformName", "Migrant Community Platform");
        settings.put("maintenanceMode", false);
        settings.put("allowRegistrations", true);
    }
    public Map<String, Object> get() { return new LinkedHashMap<>(settings); }
    public Map<String, Object> update(Map<String, Object> patch) { settings.putAll(patch); return get(); }
}
