package com.migrantcommunity.config;

import com.migrantcommunity.admin.service.AdminJwtAuthenticationFilter;
import com.migrantcommunity.security.jwt.JwtAuthenticationEntryPoint;
import com.migrantcommunity.security.jwt.JwtAuthenticationFilter;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.HeaderWriter;
import org.springframework.security.web.header.HeaderWriterFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] AUTH_PUBLIC_ENDPOINTS = {
            "/health",
            "/error",
            "/v1/auth/register",
            "/v1/auth/login",
            "/v1/auth/refresh",
            "/v1/auth/forgot-password",
            "/v1/auth/reset-password",
            "/v1/auth/verify-email",
            "/v1/auth/resend-verification",
            "/v1/oauth/google",
            "/v1/admin/auth/login",
            "/v1/admin/auth/forgot-password",
            "/v1/admin/auth/reset-password",
            "/ws/**"
    };

    private static final String[] SWAGGER_ENDPOINTS = {
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    private final Environment environment;

    public SecurityConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter userJwtFilter,
            AdminJwtAuthenticationFilter adminJwtFilter,
            JwtAuthenticationEntryPoint entryPoint) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers(AUTH_PUBLIC_ENDPOINTS).permitAll();
                if (!isProduction()) {
                    auth.requestMatchers(SWAGGER_ENDPOINTS).permitAll();
                }
                auth.requestMatchers("/v1/admin/administrators/**").hasAuthority("ROLE_SUPER_ADMIN")
                    .requestMatchers("/v1/admin/settings/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/admin/audit-logs/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/moderation/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/analytics/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/users/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_SUPPORT", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/posts/**", "/v1/admin/communities/**", "/v1/admin/events/**")
                        .hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/notifications/**", "/v1/admin/languages/**", "/v1/admin/locations/**")
                        .hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/admin/connections/**")
                        .hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/dashboard/**")
                        .hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST", "ROLE_SUPPORT", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/uploads/files/**").permitAll()
                    .requestMatchers("/v1/**").authenticated()
                    .anyRequest().permitAll();
            })
            .addFilterBefore(userJwtFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(adminJwtFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(securityHeadersFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(resolveAllowedOrigins());
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    List<String> resolveAllowedOrigins() {
        String allowedOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            return Arrays.stream(allowedOrigins.split(","))
                    .filter(Objects::nonNull)
                    .map(s -> s.trim())
                    .filter(s -> !s.isBlank())
                    .toList();
        }
        if (isProduction()) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS must be set in production");
        }
        return List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000");
    }

    @Bean
    public HeaderWriterFilter securityHeadersFilter() {
        HeaderWriter headerWriter = (request, response) -> {
            response.setHeader("X-Content-Type-Options", "nosniff");
            response.setHeader("X-Frame-Options", "DENY");
            response.setHeader("X-XSS-Protection", "1; mode=block");
            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
            response.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
            if (isProduction()) {
                response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }
        };
        return new HeaderWriterFilter(java.util.Collections.singletonList(headerWriter));
    }

    private boolean isProduction() {
        return Arrays.asList(environment.getActiveProfiles()).contains("prod")
                || "prod".equals(System.getenv("SPRING_PROFILES_ACTIVE"));
    }
}
