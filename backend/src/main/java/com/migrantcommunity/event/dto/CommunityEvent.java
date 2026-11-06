package com.migrantcommunity.event.dto;

import com.migrantcommunity.common.enums.EventStatus;

public record CommunityEvent(
        String id,
        String title,
        String description,
        String communityId,
        String communityName,
        String location,
        String city,
        String startsAt,
        String endsAt,
        Integer capacity,
        long participantCount,
        EventStatus status,
        String organizerId,
        String organizerName,
        String imageUrl,
        String createdAt
) {}