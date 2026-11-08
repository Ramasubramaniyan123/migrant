package com.migrantcommunity.unit;

import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.connection.service.ConnectionService;
import com.migrantcommunity.connection.repository.BlockRepository;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import com.migrantcommunity.language.repository.UserLanguageRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {

    @Mock ConnectionRepository connectionRepository;
    @Mock BlockRepository blockRepository;
    @Mock UserRepository userRepository;
    @Mock UserLanguageRepository userLanguageRepository;
    @Mock NotificationService notificationService;
    @InjectMocks ConnectionService service;

    private User user(long id) {
        User u = new User();
        u.setId(id);
        u.setEmail("u" + id + "@example.com");
        u.setActive(true);
        return u;
    }

    @Test
    void rejectsSelfConnection() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1)));
        assertThrows(BadRequestException.class, () -> service.sendConnectionRequest(1L, 1L));
    }

    @Test
    void rejectsBlockedPair() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1)));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user(2)));
        when(blockRepository.isBlockedBetweenUsers(1L, 2L)).thenReturn(true);
        assertThrows(ForbiddenException.class, () -> service.sendConnectionRequest(1L, 2L));
    }

    @Test
    void rejectsDuplicateRequest() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user(1)));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user(2)));
        when(blockRepository.isBlockedBetweenUsers(1L, 2L)).thenReturn(false);
        when(connectionRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(new com.migrantcommunity.connection.entity.Connection()));
        assertThrows(BadRequestException.class, () -> service.sendConnectionRequest(1L, 2L));
    }
}
