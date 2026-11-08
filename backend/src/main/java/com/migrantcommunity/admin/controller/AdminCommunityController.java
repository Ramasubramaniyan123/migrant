package com.migrantcommunity.admin.controller;

import com.migrantcommunity.community.dto.Community;
import com.migrantcommunity.community.dto.CommunityMember;
import com.migrantcommunity.community.service.AdminCommunityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/communities")
public class AdminCommunityController {

    private final AdminCommunityService service;
    public AdminCommunityController(AdminCommunityService service) { this.service = service; }

    @GetMapping
    public AdminCommunityService.CommunityListResult list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "ALL") String type,
            @RequestParam(defaultValue = "ALL") String city,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return service.list(search, type, city, status, page, pageSize);
    }

    @GetMapping("/{id}")
    public Community get(@PathVariable String id) { return service.getById(id); }

    @PostMapping
    public Community create(@RequestBody Community payload) { return service.create(payload); }

    @PutMapping("/{id}")
    public Community update(@PathVariable String id, @RequestBody Community payload) { return service.update(id, payload); }

    @PatchMapping("/{id}/active")
    public Community setActive(@PathVariable String id, @RequestParam boolean isActive) { return service.setActive(id, isActive); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }

    @GetMapping("/{id}/members")
    public List<CommunityMember> members(@PathVariable String id) { return service.listMembers(id); }

    @GetMapping("/stats")
    public AdminCommunityService.CommunityStats stats() { return service.getStats(); }
}
