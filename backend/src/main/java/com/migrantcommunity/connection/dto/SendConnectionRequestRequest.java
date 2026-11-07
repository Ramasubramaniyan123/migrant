package com.migrantcommunity.connection.dto;

import jakarta.validation.constraints.NotNull;

public record SendConnectionRequestRequest(
    @NotNull(message = "Receiver ID is required")
    Long receiverId
) {}
