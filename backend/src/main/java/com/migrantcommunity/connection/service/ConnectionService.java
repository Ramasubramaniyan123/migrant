package com.migrantcommunity.connection.service;

import com.migrantcommunity.common.enums.ConnectionStatus;
import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.connection.dto.ConnectionResponse;
import com.migrantcommunity.connection.entity.Connection;
import com.migrantcommunity.connection.repository.BlockRepository;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    private final UserLanguageRepository userLanguageRepository;
    private final NotificationService notificationService;

    public ConnectionService(ConnectionRepository connectionRepository,
                           BlockRepository blockRepository,
                           UserRepository userRepository,
                           UserLanguageRepository userLanguageRepository,
                           NotificationService notificationService) {
        this.connectionRepository = connectionRepository;
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.userLanguageRepository = userLanguageRepository;
        this.notificationService = notificationService;
    }

    public ConnectionResponse sendConnectionRequest(Long requesterId, Long receiverId) {
        // Validate users exist
        User requester = getUserById(requesterId);
        User receiver = getUserById(receiverId);

        // Business rule: Cannot send to self
        if (requesterId.equals(receiverId)) {
            throw new BadRequestException("Cannot send connection request to yourself");
        }

        // Business rule: Cannot connect with blocked users
        if (blockRepository.isBlockedBetweenUsers(requesterId, receiverId)) {
            throw new ForbiddenException("Cannot connect with blocked user");
        }

        // Check for existing connection
        if (connectionRepository.findByUsers(requesterId, receiverId).isPresent()) {
            throw new BadRequestException("Connection request already exists");
        }

        // Calculate match score
        BigDecimal matchScore = calculateMatchScore(requester, receiver);
        String matchedBy = determineMatchReason(requester, receiver);

        // Create connection
        Connection connection = new Connection(
            requester, receiver, ConnectionStatus.PENDING, matchScore, matchedBy
        );
        connection = connectionRepository.save(connection);

        // Send notification
        notificationService.createNotification(
            receiverId,
            NotificationType.CONNECTION_REQUEST,
            "New Connection Request",
            getDisplayName(requester) + " wants to connect with you",
            connection.getId()
        );

        return toResponse(connection);
    }

    public ConnectionResponse acceptConnectionRequest(Long connectionId, Long userId) {
        Connection connection = getConnectionById(connectionId);

        // Only receiver can accept
        if (!connection.getReceiver().getId().equals(userId)) {
            throw new ForbiddenException("Only the receiver can accept this request");
        }

        // Must be pending
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException("Connection request is not pending");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection = connectionRepository.save(connection);

        // Notify requester
        notificationService.createNotification(
            connection.getRequester().getId(),
            NotificationType.CONNECTION_ACCEPTED,
            "Connection Accepted",
            getDisplayName(connection.getReceiver()) + " accepted your connection request",
            connection.getId()
        );

        return toResponse(connection);
    }

    public ConnectionResponse rejectConnectionRequest(Long connectionId, Long userId) {
        Connection connection = getConnectionById(connectionId);

        // Only receiver can reject
        if (!connection.getReceiver().getId().equals(userId)) {
            throw new ForbiddenException("Only the receiver can reject this request");
        }

        // Must be pending
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException("Connection request is not pending");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(connection);

        return toResponse(connection);
    }

    public void cancelConnectionRequest(Long connectionId, Long userId) {
        Connection connection = getConnectionById(connectionId);

        // Only requester can cancel
        if (!connection.getRequester().getId().equals(userId)) {
            throw new ForbiddenException("Only the requester can cancel this request");
        }

        // Must be pending
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException("Connection request is not pending");
        }

        connectionRepository.delete(connection);
    }

    public void removeConnection(Long connectionId, Long userId) {
        Connection connection = getConnectionById(connectionId);

        // Must be accepted
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new BadRequestException("Can only remove accepted connections");
        }

        // Must be either user in the connection
        if (!connection.getRequester().getId().equals(userId) && 
            !connection.getReceiver().getId().equals(userId)) {
            throw new ForbiddenException("You are not part of this connection");
        }

        connectionRepository.delete(connection);
    }

    @Transactional(readOnly = true)
    public Page<ConnectionResponse> getMyConnections(Long userId, ConnectionStatus status, Pageable pageable) {
        Page<Connection> connections;
        
        if (status != null) {
            connections = connectionRepository.findByUserIdAndStatus(userId, status, pageable);
        } else {
            connections = connectionRepository.findByUserIdAndStatus(userId, ConnectionStatus.ACCEPTED, pageable);
        }

        return connections.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ConnectionResponse> getPendingRequests(Long userId, Pageable pageable) {
        return connectionRepository
            .findByReceiverIdAndStatus(userId, ConnectionStatus.PENDING, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ConnectionResponse> getSentRequests(Long userId, Pageable pageable) {
        return connectionRepository
            .findByRequesterIdAndStatus(userId, ConnectionStatus.PENDING, pageable)
            .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public boolean areUsersConnected(Long user1Id, Long user2Id) {
        return connectionRepository.areUsersConnected(user1Id, user2Id);
    }

    @Transactional(readOnly = true)
    public long getConnectionCount(Long userId) {
        return connectionRepository.countByUserIdAndStatus(userId, ConnectionStatus.ACCEPTED);
    }

    private BigDecimal calculateMatchScore(User user1, User user2) {
        BigDecimal score = BigDecimal.ZERO;
        Profile profile1 = user1.getProfile();
        Profile profile2 = user2.getProfile();

        if (profile1 == null || profile2 == null) {
            return score;
        }

        // Same hometown city: +40 points
        if (profile1.getHometownCity() != null && profile1.getHometownCity().equalsIgnoreCase(profile2.getHometownCity())) {
            score = score.add(new BigDecimal("40"));
        }
        // Same hometown country: +20 points
        else if (profile1.getHometownCountry() != null && profile1.getHometownCountry().equalsIgnoreCase(profile2.getHometownCountry())) {
            score = score.add(new BigDecimal("20"));
        }

        // Shared languages: +10 points each
        Set<Long> languages1 = getUserLanguageIds(user1.getId());
        Set<Long> languages2 = getUserLanguageIds(user2.getId());
        
        languages1.retainAll(languages2); // Intersection
        int sharedLanguages = languages1.size();
        score = score.add(new BigDecimal(sharedLanguages * 10));

        // Nearby location: +15 points (within 50km)
        if (profile1.getCurrentLocation() != null && profile2.getCurrentLocation() != null) {
            double distance = profile1.getCurrentLocation().distance(profile2.getCurrentLocation());
            // Convert from degrees to km (rough approximation)
            double distanceKm = distance * 111.32; // 1 degree ≈ 111.32 km at equator
            
            if (distanceKm < 50) {
                score = score.add(new BigDecimal("15"));
            }
        }

        return score;
    }

    private String determineMatchReason(User user1, User user2) {
        Profile profile1 = user1.getProfile();
        Profile profile2 = user2.getProfile();

        if (profile1 == null || profile2 == null) {
            return "PLATFORM";
        }

        // Priority: hometown > language > location
        if (profile1.getHometownCity() != null && profile1.getHometownCity().equalsIgnoreCase(profile2.getHometownCity())) {
            return "HOMETOWN";
        }

        Set<Long> languages1 = getUserLanguageIds(user1.getId());
        Set<Long> languages2 = getUserLanguageIds(user2.getId());
        languages1.retainAll(languages2);
        
        if (!languages1.isEmpty()) {
            return "LANGUAGE";
        }

        if (profile1.getCurrentLocation() != null && profile2.getCurrentLocation() != null) {
            return "LOCATION";
        }

        return "PLATFORM";
    }

    private Set<Long> getUserLanguageIds(Long userId) {
        return userLanguageRepository.findByUserId(userId)
            .stream()
            .map(ul -> ul.getLanguage().getId())
            .collect(Collectors.toSet());
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private Connection getConnectionById(Long connectionId) {
        return connectionRepository.findById(connectionId)
            .orElseThrow(() -> new ResourceNotFoundException("Connection", "id", connectionId));
    }

    private String getDisplayName(User user) {
        Profile profile = user.getProfile();
        if (profile != null && profile.getFirstName() != null) {
            return profile.getFirstName();
        }
        return user.getEmail().split("@")[0];
    }

    private ConnectionResponse toResponse(Connection connection) {
        return new ConnectionResponse(
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
        );
    }
}
