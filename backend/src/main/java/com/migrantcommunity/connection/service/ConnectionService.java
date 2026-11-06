package com.migrantcommunity.connection.service;

import com.migrantcommunity.common.enums.ConnectionStatus;
import com.migrantcommunity.connection.dto.ConnectionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder connection logic for the prototype. */
@Service
public class ConnectionService {

    /**
     * Returns placeholder connections.
     * The real implementation will read the connections table from the database.
     */
    public List<ConnectionResponse> connections() {
        return List.of(
                new ConnectionResponse("con_001", "usr_001", "usr_002", ConnectionStatus.ACCEPTED.name()),
                new ConnectionResponse("con_002", "usr_003", "usr_001", ConnectionStatus.PENDING.name()));
    }

    /**
     * Returns a placeholder connection request.
     * The real implementation will persist a new row with status
     * {@link ConnectionStatus#PENDING} in the database.
     */
    public ConnectionResponse request(String requesterId, String addresseeId) {
        return new ConnectionResponse("con_new", requesterId, addresseeId, ConnectionStatus.PENDING.name());
    }
}
