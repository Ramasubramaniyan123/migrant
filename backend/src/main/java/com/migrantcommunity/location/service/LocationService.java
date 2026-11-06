package com.migrantcommunity.location.service;

import com.migrantcommunity.location.dto.LocationResponse;
import org.springframework.stereotype.Service;

/** Placeholder location logic for the prototype. */
@Service
public class LocationService {

    /**
     * Returns a placeholder approximate location.
     * The real implementation will query the PostGIS-backed locations table and
     * deliberately coarsen coordinates before they leave the server.
     */
    public LocationResponse approximateLocation() {
        return new LocationResponse(19.0760, 72.8777, 5.0, "Mumbai");
    }
}
