package com.migrantcommunity.event.dto;

public record EventParticipant(
        String id,
        String eventId,
        String userId,
        String userName,
        String status,
        String registeredAt
) {}