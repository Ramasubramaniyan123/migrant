package com.migrantcommunity.discovery.controller;

import com.migrantcommunity.discovery.dto.DiscoveryResponse;
import com.migrantcommunity.discovery.service.DiscoveryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for discovery endpoints. */
@RestController
@RequestMapping("/api/discovery")
public class DiscoveryController {

    private final DiscoveryService discoveryService;

    public DiscoveryController(DiscoveryService discoveryService) {
        this.discoveryService = discoveryService;
    }

    @GetMapping("/suggestions")
    public DiscoveryResponse suggestions() {
        return discoveryService.suggestions();
    }
}
