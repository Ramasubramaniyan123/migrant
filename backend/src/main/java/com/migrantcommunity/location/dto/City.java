package com.migrantcommunity.location.dto;

public record City(
        String id,
        String name,
        String state,
        long userCount,
        long localityCount
) {}