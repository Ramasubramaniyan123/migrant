package com.migrantcommunity.language.dto;

/** A language supported by the platform. */
public record LanguageResponse(Long id, String code, String name, String nativeName) {
}
