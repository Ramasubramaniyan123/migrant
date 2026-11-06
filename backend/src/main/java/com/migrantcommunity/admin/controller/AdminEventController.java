package com.migrantcommunity.admin.controller;

import com.migrantcommunity.event.dto.CommunityEvent;
import com.migrantcommunity.event.dto.EventParticipant;
import com.migrantcommunity.event.service.AdminEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/events")
public class AdminEventController {

    private final AdminEventService service;
    public AdminEventController(AdminEventService service) { this.service = service; }

    @GetMapping
    public List<CommunityEvent> list() { return service.list(); }

    @GetMapping("/{id}")
    public CommunityEvent get(@PathVariable String id) { return service.getById(id); }

    @PostMapping
    public CommunityEvent create(@RequestBody CommunityEvent payload) { return service.create(payload); }

    @PutMapping("/{id}")
    public CommunityEvent update(@PathVariable String id, @RequestBody CommunityEvent payload) { return service.update(id, payload); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }

    @GetMapping("/{id}/participants")
    public List<EventParticipant> participants(@PathVariable String id) { return service.participants(id); }
}
