package com.migrantcommunity.security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

/**
 * Service to track login attempts and implement account lockout.
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 30 * 60 * 1000; // 30 minutes

    private final ConcurrentMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Long> lockCache = new ConcurrentHashMap<>();

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0) + 1;
        attemptsCache.put(key, attempts);
        
        if (attempts >= MAX_ATTEMPTS) {
            lock(key);
        }
    }

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        lockCache.remove(key);
    }

    public boolean isLocked(String key) {
        Long lockTime = lockCache.get(key);
        if (lockTime == null) {
            return false;
        }
        
        if (System.currentTimeMillis() - lockTime > LOCK_TIME_DURATION) {
            lockCache.remove(key);
            attemptsCache.remove(key);
            return false;
        }
        
        return true;
    }

    private void lock(String key) {
        lockCache.put(key, System.currentTimeMillis());
    }

    public long getRemainingLockTime(String key) {
        Long lockTime = lockCache.get(key);
        if (lockTime == null) {
            return 0;
        }
        long elapsed = System.currentTimeMillis() - lockTime;
        long remaining = LOCK_TIME_DURATION - elapsed;
        return remaining > 0 ? remaining : 0;
    }
}
