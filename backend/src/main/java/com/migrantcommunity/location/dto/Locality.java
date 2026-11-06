package com.migrantcommunity.location.dto;

public record Locality(
        String id,
        String name,
        String cityId,
        String cityName,
        long userCount
) {}