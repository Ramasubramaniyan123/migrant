package com.migrantcommunity.common.exception;

/** Thrown when a request is malformed or violates a business rule. */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
