package com.migrantcommunity.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory rate limiting filter to prevent brute-force attacks and DoS.
 * Uses a fixed-window counter approach.
 *
 * X-Forwarded-For is only trusted when the direct peer is a private/loopback
 * address (i.e. a same-host or LAN reverse proxy). Direct internet clients
 * cannot spoof their IP to bypass limits.
 */
@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final ClientIpResolver clientIpResolver;
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    public RateLimitFilter(ClientIpResolver clientIpResolver) {
        this.clientIpResolver = clientIpResolver;
    }

    // Rate limits: 10 requests per minute for auth endpoints, 100 per minute for others
    private static final int AUTH_REQUESTS_PER_MINUTE = 10;
    private static final int GENERAL_REQUESTS_PER_MINUTE = 100;
    private static final long WINDOW_SIZE_MS = 60_000; // 1 minute
    private static final int MAX_TRACKED_KEYS = 100_000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String clientIp = clientIpResolver.resolve(httpRequest);
        String path = httpRequest.getRequestURI();

        // Stricter rate limiting for authentication endpoints
        int limit = path.contains("/auth/") ? AUTH_REQUESTS_PER_MINUTE : GENERAL_REQUESTS_PER_MINUTE;

        if (checkRateLimit(clientIp, limit)) {
            chain.doFilter(request, response);
        } else {
            httpResponse.setStatus(429); // Too Many Requests
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Please try again later.\"}");
        }
    }

    private boolean checkRateLimit(String key, int limit) {
        long now = System.currentTimeMillis();
        // Bound memory: drop expired windows when the map grows too large.
        if (windows.size() > MAX_TRACKED_KEYS) {
            windows.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_SIZE_MS);
        }
        Window window = windows.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStart > WINDOW_SIZE_MS) {
                return new Window(now, new AtomicInteger(0));
            }
            return existing;
        });
        return window.count.incrementAndGet() <= limit;
    }

    private static final class Window {
        private final long windowStart;
        private final AtomicInteger count;

        private Window(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
