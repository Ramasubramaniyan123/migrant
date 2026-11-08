package com.migrantcommunity.admin.controller;

import com.migrantcommunity.user.dto.PlatformUser;
import com.migrantcommunity.user.dto.UserActivityEntry;
import com.migrantcommunity.user.service.AdminUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/users")
public class AdminUserController {

    private final AdminUserService service;
    public AdminUserController(AdminUserService service) { this.service = service; }

    @GetMapping
    public AdminUserService.UserListResult list(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "ALL") String city,
            @RequestParam(defaultValue = "ALL") String language,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return service.list(search, status, city, language, page, pageSize);
    }

    @GetMapping("/{id}")
    public PlatformUser get(@PathVariable String id) { return service.getById(id); }

    @GetMapping("/{id}/activity")
    public List<UserActivityEntry> activity(@PathVariable String id) { return service.getActivity(id); }

    @PatchMapping("/{id}/suspend")
    public PlatformUser suspend(@PathVariable String id) { return service.suspend(id); }

    @PatchMapping("/{id}/activate")
    public PlatformUser activate(@PathVariable String id) { return service.activate(id); }

    @PatchMapping("/{id}/verify")
    public PlatformUser verify(@PathVariable String id) { return service.verify(id); }

    @PatchMapping("/{id}/deactivate")
    public PlatformUser deactivate(@PathVariable String id) { return service.deactivate(id); }

    @GetMapping("/filter-options")
    public AdminUserService.FilterOptions filterOptions() { return service.getFilterOptions(); }
}
