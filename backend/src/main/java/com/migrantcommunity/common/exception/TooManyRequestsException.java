package com.migrantcommunity.common.exception;

/** Thrown when a client exceeds a rate or attempt limit. Maps to HTTP 429. */
public class TooManyRequestsException extends RuntimeException {

    public TooManyRequestsException(String message) {
        super(message);
    }
}
