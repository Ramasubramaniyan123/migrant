package com.migrantcommunity.admin.controller;

import com.migrantcommunity.location.dto.City;
import com.migrantcommunity.location.dto.Locality;
import com.migrantcommunity.location.service.AdminLocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/locations")
public class AdminLocationController {

    private final AdminLocationService service;
    public AdminLocationController(AdminLocationService service) { this.service = service; }

    @GetMapping("/cities")
    public List<City> cities() { return service.listCities(); }

    @GetMapping("/localities")
    public List<Locality> localities(@RequestParam(required = false) String cityId) { return service.listLocalities(cityId); }

    @PostMapping("/localities")
    public Locality createLocality(@RequestBody Map<String, String> body) {
        return service.createLocality(body.get("name"), body.get("cityId"));
    }

    @PatchMapping("/localities/{id}")
    public Locality updateLocality(@PathVariable String id, @RequestBody Map<String, String> body) {
        return service.updateLocality(id, body.get("name"));
    }

    @GetMapping("/stats")
    public AdminLocationService.LocStats stats() { return service.getStats(); }
}
