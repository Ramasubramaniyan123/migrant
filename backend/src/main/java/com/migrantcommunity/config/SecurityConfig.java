package com.migrantcommunity.config;

import com.migrantcommunity.admin.service.AdminJwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AdminJwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(unauthorizedEntryPoint()))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            "/v1/admin/auth/login",
                            "/v1/admin/auth/forgot-password",
                            "/v1/admin/auth/reset-password",
                            "/health").permitAll()
                    .requestMatchers("/v1/admin/administrators/**").hasAuthority("ROLE_SUPER_ADMIN")
                    .requestMatchers("/v1/admin/settings/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN")
                    .requestMatchers("/v1/admin/audit-logs/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/moderation/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR")
                    .requestMatchers("/v1/admin/analytics/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_ANALYST")
                    .requestMatchers("/v1/admin/**").authenticated()
                    .requestMatchers("/api/admin/**").authenticated()
                    .anyRequest().permitAll())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    private AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (request, response, exception) -> response.sendError(HttpStatus.UNAUTHORIZED.value());
    }
}