package com.migrantcommunity.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RateLimitFilterTest {

    @Mock
    private HttpServletRequest request;
    
    @Mock
    private HttpServletResponse response;
    
    @Mock
    private FilterChain filterChain;
    
    private RateLimitFilter rateLimitFilter;

    @BeforeEach
    void setUp() {
        rateLimitFilter = new RateLimitFilter();
    }

    @Test
    void testAllowRequestsWithinLimit() throws ServletException, IOException {
        when(request.getRequestURI()).thenReturn("/v1/communities");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("X-Real-IP")).thenReturn(null);
        lenient().when(response.getWriter()).thenReturn(new PrintWriter(new StringWriter()));

        rateLimitFilter.doFilter(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    void testBlockRequestsAboveLimit() throws ServletException, IOException {
        when(request.getRequestURI()).thenReturn("/v1/auth/login");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("X-Real-IP")).thenReturn(null);
        when(response.getWriter()).thenReturn(new PrintWriter(new StringWriter()));

        // Make 11 requests (limit is 10 for auth endpoints)
        for (int i = 0; i < 11; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        verify(filterChain, times(10)).doFilter(request, response);
        verify(response).setStatus(429);
    }

    @Test
    void testRateLimitingByPath() throws ServletException, IOException {
        when(request.getRequestURI()).thenReturn("/v1/auth/login");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("X-Real-IP")).thenReturn(null);
        when(response.getWriter()).thenReturn(new PrintWriter(new StringWriter()));

        // Auth endpoints have stricter limit (10 req/min)
        for (int i = 0; i < 11; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        verify(response).setStatus(429);
    }

    @Test
    void testRateLimitingByIp() throws ServletException, IOException {
        when(request.getRequestURI()).thenReturn("/v1/communities");
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("X-Real-IP")).thenReturn(null);
        when(response.getWriter()).thenReturn(new PrintWriter(new StringWriter()));

        // Make 101 requests (limit is 100 for general endpoints)
        for (int i = 0; i < 101; i++) {
            rateLimitFilter.doFilter(request, response, filterChain);
        }

        verify(filterChain, times(100)).doFilter(request, response);
        verify(response).setStatus(429);
    }
}
