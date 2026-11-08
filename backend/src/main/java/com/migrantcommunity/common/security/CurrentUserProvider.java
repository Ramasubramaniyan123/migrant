package com.migrantcommunity.common.security;

import com.migrantcommunity.common.exception.UnauthorizedException;
import com.migrantcommunity.security.CustomUserDetails;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resolves the currently authenticated platform user from the security context.
 * Controllers and services use this instead of trusting client-supplied IDs.
 */
@Component
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("Authentication required");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof CustomUserDetails details) {
            return details.getUser();
        }
        if (principal instanceof User user) {
            return user;
        }
        if (principal instanceof String email) {
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new UnauthorizedException("User not found"));
        }
        throw new UnauthorizedException("Unsupported principal type");
    }

    public Long requireUserId() {
        return requireUser().getId();
    }
}
