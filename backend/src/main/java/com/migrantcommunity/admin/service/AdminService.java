package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.AdminResponse;
import org.springframework.stereotype.Service;

/** Placeholder admin dashboard logic for the prototype. */
@Service
public class AdminService {

    /**
     * Returns placeholder statistics.
     * The real implementation will aggregate counts across the users,
     * communities and reports tables in the database.
     */
    public AdminResponse statistics() {
        return new AdminResponse(1024, 18, 3);
    }
}
