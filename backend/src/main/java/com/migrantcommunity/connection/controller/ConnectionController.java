package com.migrantcommunity.connection.controller;

import com.migrantcommunity.connection.dto.ConnectionResponse;
import com.migrantcommunity.connection.service.ConnectionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** REST entry point for connection endpoints. */
@RestController
@RequestMapping("/api/connection")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping("/list")
    public List<ConnectionResponse> listConnections() {
        return connectionService.connections();
    }

    @PostMapping("/request")
    public ConnectionResponse requestConnection(@RequestBody Map<String, String> payload) {
        return connectionService.request(payload.get("requesterId"), payload.get("addresseeId"));
    }
}
