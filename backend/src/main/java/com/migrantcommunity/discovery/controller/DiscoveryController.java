package com.migrantcommunity.discovery.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.discovery.dto.DiscoveredUser;
import com.migrantcommunity.discovery.service.DiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for people-discovery endpoints. */
@RestController
@RequestMapping("/v1/discovery")
@Tag(name = "Discovery", description = "Privacy-aware people discovery")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/suggestions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Discover nearby people with optional filters")
    public ResponseEntity<ApiResponse<PageResult<DiscoveredUser>>> suggestions(
            @RequestParam(required = false) Double radiusKm,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) String hometownCity,
            @RequestParam(required = false) String currentCity,
            @RequestParam(required = false) Long languageId,
            @RequestParam(required = false) String interest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<DiscoveredUser> result = discoveryService.discover(
                radiusKm, latitude, longitude, hometownCity, currentCity,
                languageId, interest, page, size);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(result.getContent(), result.getNumber(),
                        result.getSize(), result.getTotalElements()),
                "Discovery results"));
    }

    @GetMapping("/hometown")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Discover people from the same or selected hometown")
    public ResponseEntity<ApiResponse<PageResult<DiscoveredUser>>> byHometown(
            @RequestParam(required = false) String hometownCity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<DiscoveredUser> result = discoveryService.discoverByHometown(hometownCity, page, size);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(result.getContent(), result.getNumber(),
                        result.getSize(), result.getTotalElements()),
                "Hometown matches"));
    }
}
