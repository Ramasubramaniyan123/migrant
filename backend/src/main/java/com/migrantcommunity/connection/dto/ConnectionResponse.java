package com.migrantcommunity.connection.dto;

/** A connection request between two users. */
public record ConnectionResponse(String connectionId, String requesterId, String addresseeId, String status) {
}
