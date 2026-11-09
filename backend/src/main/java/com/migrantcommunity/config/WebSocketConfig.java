package com.migrantcommunity.config;

import com.migrantcommunity.security.jwt.JwtService;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;

    public WebSocketConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                        message, StompHeaderAccessor.class);
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = extractToken(accessor);
                    if (token == null) {
                        throw new IllegalArgumentException("Missing JWT token");
                    }
                    try {
                        var claims = jwtService.parse(token);
                        // Only user access tokens may open a messaging socket;
                        // refresh and admin-portal tokens are rejected.
                        Object userIdClaim = claims.get("userId");
                        boolean usable = userIdClaim != null
                                && !"refresh".equals(claims.get("type", String.class))
                                && !"admin".equals(claims.get("tokenUse", String.class));
                        if (!usable) {
                            throw new IllegalArgumentException("Token not permitted for WebSocket");
                        }
                        String userId = String.valueOf(userIdClaim);
                        accessor.setUser(new Principal() {
                            @Override
                            public String getName() {
                                return userId;
                            }
                        });
                    } catch (Exception ex) {
                        throw new IllegalArgumentException("Invalid JWT token");
                    }
                }
                if (accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    // Clients may only subscribe to their own /user destinations;
                    // /topic and raw /queue channels are not exposed.
                    String destination = accessor.getDestination();
                    if (destination == null || !destination.startsWith("/user/")) {
                        throw new IllegalArgumentException("Subscription not permitted");
                    }
                }
                return message;
            }

            private String extractToken(StompHeaderAccessor accessor) {
                List<String> auth = accessor.getNativeHeader("Authorization");
                if (auth != null && !auth.isEmpty() && auth.get(0).startsWith("Bearer ")) {
                    return auth.get(0).substring(7).trim();
                }
                String query = accessor.getFirstNativeHeader("query");
                return query;
            }
        });
    }
}
