package com.migrantcommunity.config;

import com.migrantcommunity.admin.service.AdminJwtAuthenticationFilter;
import com.migrantcommunity.security.jwt.JwtAuthenticationEntryPoint;
import com.migrantcommunity.security.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/health",
            "/error",
            "/v1/auth/register",
            "/v1/auth/login",
            "/v1/auth/refresh",
            "/v1/auth/forgot-password",
            "/v1/auth/reset-password",
            "/v1/auth/verify-email",
            "/v1/auth/resend-verification",
            "/v1/admin/auth/login",
            "/v1/admin/auth/refresh",
            "/v1/admin/auth/forgot-password",
            "/v1/admin/auth/reset-password",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/ws/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter userJwtFilter,
            AdminJwtAuthenticationFilter adminJwtFilter,
            AuthenticationEntryPoint entryPoint) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                    // Admin RBAC — evaluated before the generic authenticated rule
                    .requestMatchers("/v1/admin/administrators/**").hasAuthority("ROLE_SUPER_ADMIN")
                    .requestMatchers("/v1/admin/settings/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/admin/audit-logs/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/moderation/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/analytics/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_SUPPORT", "ROLE_ANALYST")
                    // Everything else under /v1 requires an authenticated user
                    .requestMatchers("/v1/**").authenticated()
                    .anyRequest().permitAll())
            .addFilterBefore(userJwtFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(adminJwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
