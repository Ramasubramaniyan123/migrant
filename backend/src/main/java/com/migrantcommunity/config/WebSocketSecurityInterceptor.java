package com.migrantcommunity.config;

import com.migrantcommunity.security.jwt.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

/**
 * Authenticates STOMP CONNECT with a user access token and restricts
 * SUBSCRIBE destinations to the authenticated user's own queues.
 */
@Component
public class WebSocketSecurityInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;

    public WebSocketSecurityInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) {
            return message;
        }
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            bindPrincipal(accessor);
        }
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())
                || StompCommand.SEND.equals(accessor.getCommand())) {
            authorizeDestination(accessor);
        }
        return message;
    }

    void bindPrincipal(StompHeaderAccessor accessor) {
        String token = extractBearerToken(accessor);
        if (token == null) {
            throw new IllegalArgumentException("Missing JWT token");
        }
        try {
            Claims claims = jwtService.parse(token);
            Object userIdClaim = claims.get("userId");
            boolean usable = userIdClaim != null
                    && "user".equals(claims.get("tokenUse", String.class))
                    && !"refresh".equals(claims.get("type", String.class));
            if (!usable) {
                throw new IllegalArgumentException("Token not permitted for WebSocket");
            }
            String userId = String.valueOf(userIdClaim);
            accessor.setUser(() -> userId);
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT token");
        }
    }

    void authorizeDestination(StompHeaderAccessor accessor) {
        Principal principal = accessor.getUser();
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new IllegalArgumentException("Not authenticated");
        }
        String destination = accessor.getDestination();
        if (destination == null) {
            throw new IllegalArgumentException("Destination required");
        }
        String userId = principal.getName();
        // Spring rewrites /user/queue/* to /user/{principal}/queue/* server-side.
        // Direct /user/{otherId}/... subscriptions are IDOR and must be rejected.
        boolean ownUserDestination = destination.startsWith("/user/queue/")
                || destination.startsWith("/user/topic/")
                || destination.startsWith("/user/" + userId + "/");
        boolean appDestination = destination.startsWith("/app/");
        if (!ownUserDestination && !appDestination) {
            throw new IllegalArgumentException("Subscription not permitted");
        }
    }

    static String extractBearerToken(StompHeaderAccessor accessor) {
        List<String> auth = accessor.getNativeHeader("Authorization");
        if (auth != null && !auth.isEmpty() && auth.get(0) != null && auth.get(0).startsWith("Bearer ")) {
            return auth.get(0).substring(7).trim();
        }
        return null;
    }
}
