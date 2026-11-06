package com.migrantcommunity.language.dto;

public record Language(
        String id,
        String name,
        String nativeName,
        String code,
        boolean isActive,
        long userCount,
        long communityCount
) {}