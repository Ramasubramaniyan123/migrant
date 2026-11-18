package com.migrantcommunity.security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Per-IP attempt limiter for password-reset OTP verification. Because OTPs are
 * stored hashed, failed guesses cannot be attributed to a specific token row;
 * the brute-force boundary is therefore the client IP plus the short OTP TTL.
 */
@Service
public class PasswordResetAttemptService {

    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_MILLIS = 10 * 60 * 1000L; // 10 minutes
    private static final int MAX_TRACKED_KEYS = 50_000;

    private final ConcurrentMap<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    public void checkAllowed(String ip) {
        if (ip == null || ip.isBlank()) {
            return;
        }
        long now = System.currentTimeMillis();
        AttemptWindow window = attempts.compute(ip, (k, existing) -> {
            if (existing == null || now - existing.windowStart > WINDOW_MILLIS) {
                return new AttemptWindow(now, 0);
            }
            return existing;
        });
        if (window.count >= MAX_ATTEMPTS) {
            throw new com.migrantcommunity.common.exception.TooManyRequestsException(
                    "Too many password reset attempts. Please try again later.");
        }
        window.count++;
        if (attempts.size() > MAX_TRACKED_KEYS) {
            attempts.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_MILLIS);
        }
    }

    public void reset(String ip) {
        if (ip != null) {
            attempts.remove(ip);
        }
    }

    private static final class AttemptWindow {
        private final long windowStart;
        private int count;

        private AttemptWindow(long windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
