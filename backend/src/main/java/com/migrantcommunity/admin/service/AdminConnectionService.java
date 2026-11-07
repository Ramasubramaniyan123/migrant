package com.migrantcommunity.admin.service;

import com.migrantcommunity.connection.dto.ConnectionResponse;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminConnectionService {
    
    private final ConnectionRepository connectionRepository;
    
    public AdminConnectionService(ConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }
    
    public Page<ConnectionResponse> list(Pageable pageable) {
        return connectionRepository.findAll(pageable).map(connection ->
            new ConnectionResponse(
                connection.getId(),
                connection.getRequester().getId(),
                getDisplayName(connection.getRequester()),
                connection.getReceiver().getId(),
                getDisplayName(connection.getReceiver()),
                connection.getStatus(),
                connection.getMatchScore(),
                connection.getMatchedBy(),
                connection.getCreatedAt(),
                connection.getUpdatedAt()
            )
        );
    }
    
    public Map<String, Object> stats() {
        long total = connectionRepository.count();
        return Map.of(
            "totalConnections", total,
            "pendingRequests", 0L,
            "accepted", 0L,
            "rejected", 0L
        );
    }
    
    private String getDisplayName(com.migrantcommunity.user.entity.User user) {
        com.migrantcommunity.profile.entity.Profile profile = user.getProfile();
        if (profile != null && profile.getFirstName() != null) {
            return profile.getFirstName();
        }
        return user.getEmail().split("@")[0];
    }
}
