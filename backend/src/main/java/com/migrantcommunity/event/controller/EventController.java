package com.migrantcommunity.event.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.event.service.EventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

/** REST entry point for community event endpoints. */
@RestController
@RequestMapping("/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<EventService.EventResponse>>> upcoming(
            @RequestParam(required = false) Long communityId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EventService.EventResponse> page = eventService.upcoming(communityId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Events retrieved"));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<EventService.EventResponse>>> mine(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EventService.EventResponse> page = eventService.myEvents(pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Registered events retrieved"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventService.EventResponse>> details(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.details(id), "Event retrieved"));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventService.EventResponse>> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.create(
                asLong(body.get("communityId")),
                asString(body.get("title")),
                asString(body.get("description")),
                asString(body.get("location")),
                asInstant(body.get("startTime")),
                asInstant(body.get("endTime")),
                asInteger(body.get("maxParticipants"))), "Event created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventService.EventResponse>> update(
            @PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok(eventService.update(
                id, asString(body.get("title")), asString(body.get("description")),
                asString(body.get("location")), asInstant(body.get("startTime")),
                asInstant(body.get("endTime")), asInteger(body.get("maxParticipants"))), "Event updated"));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable Long id) {
        eventService.cancel(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Event cancelled"));
    }

    @PostMapping("/{id}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> register(@PathVariable Long id) {
        eventService.register(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Registered for event"));
    }

    @DeleteMapping("/{id}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(@PathVariable Long id) {
        eventService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Registration cancelled"));
    }

    @GetMapping("/{id}/participants")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<EventService.ParticipantInfo>>> participants(
            @PathVariable Long id, @PageableDefault(size = 50) Pageable pageable) {
        Page<EventService.ParticipantInfo> page = eventService.participants(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Participants retrieved"));
    }

    private static Long asLong(Object v) { return v == null ? null : ((Number) v).longValue(); }
    private static Integer asInteger(Object v) { return v == null ? null : ((Number) v).intValue(); }
    private static String asString(Object v) { return v == null ? null : v.toString(); }
    private static Instant asInstant(Object v) { return v == null ? null : Instant.parse(v.toString()); }
}
