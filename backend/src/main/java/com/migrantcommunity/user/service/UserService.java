package com.migrantcommunity.user.service;

import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.profile.repository.ProfileRepository;
import com.migrantcommunity.user.dto.UserResponse;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public UserService(UserRepository userRepository, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getRole() != null) {
            user.setRole(updatedUser.getRole());
        }
        return userRepository.save(user);
    }

    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setActive(true);
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public long getTotalUserCount() {
        return userRepository.count();
    }

    public long getActiveUserCount() {
        return userRepository.countByActive(true);
    }

    public UserResponse getUserResponse(Long userId) {
        User user = getUserById(userId);
        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        
        String fullName = "";
        if (profile != null && profile.getFirstName() != null) {
            fullName = profile.getFirstName();
            if (profile.getLastName() != null) {
                fullName += " " + profile.getLastName();
            }
        }
        
        String hometown = null;
        if (profile != null && profile.getHometownCity() != null) {
            hometown = profile.getHometownCity();
            if (profile.getHometownCountry() != null) {
                hometown += ", " + profile.getHometownCountry();
            }
        }
        
        return new UserResponse(
            user.getId().toString(),
            fullName,
            user.getEmail(),
            hometown
        );
    }


    public Profile getUserProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "userId", userId));
    }
}
