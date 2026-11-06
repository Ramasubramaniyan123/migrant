package com.migrantcommunity.language.dto;

/** A language supported by the platform. */
public record LanguageResponse(String code, String name, String nativeName) {
}
