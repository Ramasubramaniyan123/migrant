package com.migrantcommunity.common.validation;

/** Reusable regular expressions for validating incoming request payloads. */
public final class ValidationPatterns {

    public static final String EMAIL = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    public static final String PASSWORD = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$";

    private ValidationPatterns() {
    }
}
