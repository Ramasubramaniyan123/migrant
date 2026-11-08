package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.Administrator;
import com.migrantcommunity.admin.dto.AdminLoginRequest;
import com.migrantcommunity.admin.dto.AdminLoginResponse;
import com.migrantcommunity.admin.entity.AdminPasswordResetToken;
import com.migrantcommunity.admin.repository.AdminPasswordResetTokenRepository;
import com.migrantcommunity.admin.repository.AdministratorRepository;
import com.migrantcommunity.common.email.EmailService;
import com.migrantcommunity.common.enums.AdminRole;
import com.migrantcommunity.common.enums.AdminStatus;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AdminAuthService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long RESET_TOKEN_TTL_MINUTES = 30;

    private final AdministratorRepository administratorRepository;
    private final AdminPasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminJwtService jwtService;
    private final EmailService emailService;
    private final String bootstrapEmail;
    private final String bootstrapPassword;
    private final String appBaseUrl;

    public AdminAuthService(
            AdministratorRepository administratorRepository,
            AdminPasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            AdminJwtService jwtService,
            EmailService emailService,
            @Value("${admin.bootstrap.email:}") String bootstrapEmail,
            @Value("${admin.bootstrap.password:}") String bootstrapPassword,
            @Value("${app.base-url:http://localhost:5173}") String appBaseUrl) {
        this.administratorRepository = administratorRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.bootstrapEmail = bootstrapEmail;
        this.bootstrapPassword = bootstrapPassword;
        this.appBaseUrl = appBaseUrl;
    }

    @PostConstruct
    void ensureBootstrapAdmin() {
        if (bootstrapEmail.isBlank() != bootstrapPassword.isBlank()) {
            throw new IllegalStateException("Configure both admin bootstrap email and password");
        }
        if (bootstrapPassword.isBlank()) {
            return;
        }
        if (bootstrapPassword.length() < 12) {
            throw new IllegalStateException("Admin bootstrap password must be at least 12 characters");
        }
        String email = bootstrapEmail.trim().toLowerCase(Locale.ROOT);
        if (administratorRepository.existsByEmail(email)) {
            return;
        }
        com.migrantcommunity.admin.entity.Administrator admin = new com.migrantcommunity.admin.entity.Administrator();
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(bootstrapPassword));
        admin.setFirstName("Platform");
        admin.setLastName("Administrator");
        admin.setRole(AdminRole.SUPER_ADMIN);
        admin.setStatus(AdminStatus.ACTIVE);
        administratorRepository.save(admin);
        log.info("Bootstrap super admin '{}' created", email);
    }

    @Transactional(readOnly = true)
    public AdminLoginResponse login(AdminLoginRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new BadCredentialsException("Invalid email or password");
        }
        com.migrantcommunity.admin.entity.Administrator admin = administratorRepository.findByEmail(req.email().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (admin.getStatus() != AdminStatus.ACTIVE
                || !passwordEncoder.matches(req.password(), admin.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        admin.setLastLoginAt(Instant.now());
        administratorRepository.save(admin);
        String token = jwtService.issueToken(admin.getEmail(), admin.getRole());
        return new AdminLoginResponse(toDto(admin), token);
    }

    public void logout(String token) {
        jwtService.revoke(token);
    }

    public void requestPasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        administratorRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .filter(a -> a.getStatus() == AdminStatus.ACTIVE)
                .ifPresent(admin -> {
                    AdminPasswordResetToken reset = new AdminPasswordResetToken();
                    reset.setAdministrator(admin);
                    reset.setToken(generateToken());
                    reset.setExpiresAt(Instant.now().plus(RESET_TOKEN_TTL_MINUTES, ChronoUnit.MINUTES));
                    resetTokenRepository.save(reset);

                    String link = appBaseUrl + "/admin/reset-password?token=" + reset.getToken();
                    emailService.send(admin.getEmail(), "Reset your admin password",
                            "Hello,\n\nUse the following link to reset your admin password. "
                                    + "It expires in " + RESET_TOKEN_TTL_MINUTES + " minutes.\n\n" + link
                                    + "\n\nIf you did not request this, ignore this email.");
                });
        // Always succeed silently to avoid account enumeration.
    }

    public void resetPassword(String tokenValue, String newPassword) {
        if (tokenValue == null || newPassword == null || newPassword.length() < 12) {
            throw new BadCredentialsException("Invalid or expired reset token");
        }
        AdminPasswordResetToken reset = resetTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired reset token"));
        if (!reset.isUsable()) {
            throw new BadCredentialsException("Invalid or expired reset token");
        }
        com.migrantcommunity.admin.entity.Administrator admin = reset.getAdministrator();
        admin.setPasswordHash(passwordEncoder.encode(newPassword));
        administratorRepository.save(admin);
        reset.setUsedAt(Instant.now());
        resetTokenRepository.save(reset);
    }

    @Transactional(readOnly = true)
    public List<Administrator> listAdmins() {
        return administratorRepository.findAll().stream().map(this::toDto).toList();
    }

    public Administrator createAdmin(String name, String email, AdminRole role) {
        if (name == null || name.isBlank() || email == null || email.isBlank() || role == null) {
            throw new IllegalArgumentException("Name, email, and role are required");
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (administratorRepository.existsByEmail(normalized)) {
            throw new IllegalArgumentException("An administrator with this email already exists");
        }
        String[] parts = name.trim().split("\\s+", 2);
        com.migrantcommunity.admin.entity.Administrator admin = new com.migrantcommunity.admin.entity.Administrator();
        admin.setEmail(normalized);
        admin.setFirstName(parts[0]);
        admin.setLastName(parts.length > 1 ? parts[1] : null);
        admin.setRole(role);
        admin.setStatus(AdminStatus.INVITED);
        admin.setPasswordHash(passwordEncoder.encode(generateToken()));
        return toDto(administratorRepository.save(admin));
    }

    public Administrator updateAdminRole(String id, AdminRole role) {
        com.migrantcommunity.admin.entity.Administrator admin = getEntity(id);
        admin.setRole(role);
        return toDto(administratorRepository.save(admin));
    }

    public Administrator updateAdminStatus(String id, AdminStatus status) {
        com.migrantcommunity.admin.entity.Administrator admin = getEntity(id);
        admin.setStatus(status);
        return toDto(administratorRepository.save(admin));
    }

    @Transactional(readOnly = true)
    public Optional<Administrator> find(String id) {
        return parseId(id).flatMap(administratorRepository::findById).map(this::toDto);
    }

    public Administrator getById(String id) {
        return find(id).orElseThrow(() -> new IllegalArgumentException("Admin not found"));
    }

    private com.migrantcommunity.admin.entity.Administrator getEntity(String id) {
        return parseId(id).flatMap(administratorRepository::findById)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
    }

    private Optional<Long> parseId(String id) {
        try {
            return Optional.of(Long.parseLong(id));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    private Administrator toDto(com.migrantcommunity.admin.entity.Administrator a) {
        String name = (a.getFirstName() == null ? "" : a.getFirstName())
                + (a.getLastName() == null ? "" : " " + a.getLastName());
        name = name.trim();
        if (name.isEmpty()) name = a.getEmail();
        return new Administrator(
                String.valueOf(a.getId()),
                name,
                a.getEmail(),
                a.getRole(),
                a.getStatus(),
                a.getAvatarUrl(),
                a.getLastLoginAt() != null ? a.getLastLoginAt().toString() : null,
                a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
    }

    private static String generateToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
