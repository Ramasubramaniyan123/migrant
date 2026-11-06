package com.migrantcommunity.location.controller;

import com.migrantcommunity.location.dto.LocationResponse;
import com.migrantcommunity.location.service.LocationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST entry point for location endpoints. */
@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/nearby")
    public LocationResponse nearby() {
        return locationService.approximateLocation();
    }
}
