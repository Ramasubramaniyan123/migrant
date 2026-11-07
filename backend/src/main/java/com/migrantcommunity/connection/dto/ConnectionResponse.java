package com.migrantcommunity.connection.dto;

import com.migrantcommunity.common.enums.ConnectionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record ConnectionResponse(
    Long id,
    Long requesterId,
    String requesterName,
    Long receiverId,
    String receiverName,
    ConnectionStatus status,
    BigDecimal matchScore,
    String matchedBy,
    Instant createdAt,
    Instant updatedAt
) {}
