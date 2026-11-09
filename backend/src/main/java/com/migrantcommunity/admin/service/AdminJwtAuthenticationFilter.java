package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.repository.AdministratorRepository;
import com.migrantcommunity.common.enums.AdminStatus;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

@Component
public class AdminJwtAuthenticationFilter extends OncePerRequestFilter {

    private final AdminJwtService jwtService;
    private final AdministratorRepository administratorRepository;

    public AdminJwtAuthenticationFilter(AdminJwtService jwtService,
                                        AdministratorRepository administratorRepository) {
        this.jwtService = jwtService;
        this.administratorRepository = administratorRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // This filter only authenticates admin-portal endpoints. On any other
        // path it must not interfere with user-token authentication.
        String path = request.getRequestURI();
        int ctx = request.getContextPath() != null ? request.getContextPath().length() : 0;
        String relative = path.substring(ctx);
        if (!relative.startsWith("/v1/admin/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.parse(authorization.substring(7).trim());
            String tokenId = claims.getId();
            String email = claims.getSubject();
            String role = claims.get("role", String.class);
            // Only tokens issued by the admin portal may authenticate here;
            // user access/refresh tokens are rejected even though they share
            // the signing key.
            boolean adminToken = "admin".equals(claims.get("tokenUse", String.class));
            boolean adminActive = email != null && administratorRepository
                    .findByEmail(email.trim().toLowerCase(Locale.ROOT))
                    .map(a -> a.getStatus() == AdminStatus.ACTIVE)
                    .orElse(false);
            if (!adminToken || tokenId == null || email == null || role == null
                    || jwtService.isRevoked(tokenId) || !adminActive) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JwtException | IllegalArgumentException ex) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
