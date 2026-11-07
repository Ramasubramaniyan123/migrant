package com.migrantcommunity.auth.mapper;

import com.migrantcommunity.auth.dto.AuthResponse;
import com.migrantcommunity.auth.dto.UserSummary;
import com.migrantcommunity.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public AuthResponse toResponse(User user, String accessToken, String refreshToken) {
        return new AuthResponse(accessToken, refreshToken, user.getId(), user.getEmail(), user.getRole().name());
    }

    public UserSummary toSummary(User user) {
        return new UserSummary(user.getId(), user.getEmail(), user.getRole().name(), user.isActive(), user.isVerified());
    }
}
