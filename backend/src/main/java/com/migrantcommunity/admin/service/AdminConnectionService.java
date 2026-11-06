package com.migrantcommunity.admin.service;

import com.migrantcommunity.connection.dto.ConnectionResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminConnectionService {
    public List<ConnectionResponse> list() {
        return List.of(
                new ConnectionResponse("conn_1", "usr_1", "usr_2", "ACCEPTED"),
                new ConnectionResponse("conn_2", "usr_3", "usr_4", "PENDING")
        );
    }
    public Map<String, Object> stats() {
        return Map.of("totalConnections", 5600, "pendingRequests", 320, "accepted", 5100, "rejected", 180);
    }
}
