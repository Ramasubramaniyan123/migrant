package com.migrantcommunity.config;

import org.springframework.context.annotation.Configuration;

/**
 * CORS is configured exclusively in {@link SecurityConfig} so credentialed
 * requests and origin allow-lists cannot diverge.
 */
@Configuration
public class CorsConfig {
}
