package com.migrantcommunity.admin.controller;

import com.migrantcommunity.language.dto.Language;
import com.migrantcommunity.language.service.AdminLanguageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/languages")
public class AdminLanguageController {

    private final AdminLanguageService service;
    public AdminLanguageController(AdminLanguageService service) { this.service = service; }

    @GetMapping
    public List<Language> list() { return service.list(); }

    @PostMapping
    public Language create(@RequestBody Map<String, String> body) {
        return service.create(body.get("name"), body.get("nativeName"), body.get("code"));
    }

    @PutMapping("/{id}")
    public Language update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String name = body.get("name") != null ? body.get("name").toString() : null;
        String nativeName = body.get("nativeName") != null ? body.get("nativeName").toString() : null;
        String code = body.get("code") != null ? body.get("code").toString() : null;
        Boolean isActive = body.get("isActive") != null ? Boolean.valueOf(body.get("isActive").toString()) : null;
        return service.update(id, name, nativeName, code, isActive);
    }

    @PatchMapping("/{id}/active")
    public Language setActive(@PathVariable String id, @RequestParam boolean isActive) { return service.setActive(id, isActive); }

    @GetMapping("/stats")
    public AdminLanguageService.LangStats stats() { return service.getStats(); }
}
