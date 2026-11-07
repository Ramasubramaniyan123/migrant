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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter userJwtFilter,
            AdminJwtAuthenticationFilter adminJwtFilter,
            AuthenticationEntryPoint entryPoint) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint))
            .authorizeHttpRequests(auth -> auth
                    // Public auth endpoints
                    .requestMatchers("/v1/auth/register", "/v1/auth/login",
                            "/v1/auth/logout", "/v1/auth/refresh", "/v1/auth/forgot-password",
                            "/v1/auth/reset-password").permitAll()
                    // Admin auth public endpoints
                    .requestMatchers("/v1/admin/auth/login",
                            "/v1/admin/auth/forgot-password", "/v1/admin/auth/reset-password").permitAll()
                    // Docs & health
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                            "/actuator/health", "/health").permitAll()
                    // User APIs require authentication
                    .requestMatchers("/v1/auth/**").authenticated()
                    .requestMatchers("/v1/**").authenticated()
                    // Admin RBAC
                    .requestMatchers("/v1/admin/administrators/**").hasAuthority("ROLE_SUPER_ADMIN")
                    .requestMatchers("/v1/admin/settings/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/admin/audit-logs/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/moderation/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/analytics/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/**").authenticated()
                    .anyRequest().permitAll())
            .addFilterBefore(userJwtFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(adminJwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }
}
