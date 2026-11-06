package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.Administrator;
import com.migrantcommunity.admin.dto.AdminLoginRequest;
import com.migrantcommunity.admin.dto.AdminLoginResponse;
import com.migrantcommunity.common.enums.AdminRole;
import com.migrantcommunity.common.enums.AdminStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminAuthService {

    private final List<Administrator> admins = new ArrayList<>();
    private final Map<String, String> passwordHashes = new HashMap<>();
    private final PasswordEncoder passwordEncoder;
    private final AdminJwtService jwtService;

    public AdminAuthService(
            PasswordEncoder passwordEncoder,
            AdminJwtService jwtService,
            @Value("${admin.bootstrap.email:}") String bootstrapEmail,
            @Value("${admin.bootstrap.password:}") String bootstrapPassword) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

        if (bootstrapEmail.isBlank() != bootstrapPassword.isBlank()) {
            throw new IllegalStateException("Configure both admin bootstrap email and password");
        }
        if (!bootstrapPassword.isBlank() && bootstrapPassword.length() < 12) {
            throw new IllegalStateException("Admin bootstrap password must be at least 12 characters");
        }
        if (!bootstrapEmail.isBlank() && !bootstrapPassword.isBlank()) {
            String email = bootstrapEmail.trim().toLowerCase(Locale.ROOT);
            Administrator bootstrapAdmin = new Administrator(
                    UUID.randomUUID().toString(),
                    "Platform Administrator",
                    email,
                    AdminRole.SUPER_ADMIN,
                    AdminStatus.ACTIVE,
                    null,
                    null,
                    Instant.now().toString());
            admins.add(bootstrapAdmin);
            passwordHashes.put(bootstrapAdmin.id(), passwordEncoder.encode(bootstrapPassword));
        }
    }

    public AdminLoginResponse login(AdminLoginRequest req) {
        if (req == null || req.email() == null || req.password() == null) {
            throw new BadCredentialsException("Invalid email or password");
        }
        Optional<Administrator> match = admins.stream()
                .filter(a -> a.email().equalsIgnoreCase(req.email().trim()))
                .findFirst();
        if (match.isEmpty()) {
            throw new BadCredentialsException("Invalid email or password");
        }
        Administrator admin = match.get();
        if (admin.status() != AdminStatus.ACTIVE
                || !passwordHashes.containsKey(admin.id())
                || !passwordEncoder.matches(req.password(), passwordHashes.get(admin.id()))) {
            throw new BadCredentialsException("Invalid email or password");
        }
        Administrator updated = new Administrator(admin.id(), admin.name(), admin.email(), admin.role(), admin.status(), admin.avatarUrl(), Instant.now().toString(), admin.createdAt());
        replace(updated);
        String token = jwtService.issueToken(updated.email(), updated.role());
        return new AdminLoginResponse(updated, token);
    }

    public void logout(String token) {
        jwtService.revoke(token);
    }

    public void requestPasswordReset(String email) {
        throw new UnsupportedOperationException("Password reset delivery is not configured");
    }

    public void resetPassword(String token, String newPassword) {
        throw new UnsupportedOperationException("Password reset is not configured");
    }

    public List<Administrator> listAdmins() { return new ArrayList<>(admins); }

    public Administrator createAdmin(String name, String email, AdminRole role) {
        if (name == null || name.isBlank() || email == null || email.isBlank() || role == null) {
            throw new IllegalArgumentException("Name, email, and role are required");
        }
        boolean exists = admins.stream().anyMatch(a -> a.email().equalsIgnoreCase(email.trim()));
        if (exists) throw new IllegalArgumentException("An administrator with this email already exists");
        Administrator a = new Administrator(UUID.randomUUID().toString(), name.trim(), email.trim().toLowerCase(Locale.ROOT), role, AdminStatus.INVITED, null, null, Instant.now().toString());
        admins.add(a);
        return a;
    }

    public Administrator updateAdminRole(String id, AdminRole role) {
        Administrator a = find(id).orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Administrator u = new Administrator(a.id(), a.name(), a.email(), role, a.status(), a.avatarUrl(), a.lastLoginAt(), a.createdAt());
        replace(u);
        return u;
    }

    public Administrator updateAdminStatus(String id, AdminStatus status) {
        Administrator a = find(id).orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        Administrator u = new Administrator(a.id(), a.name(), a.email(), a.role(), status, a.avatarUrl(), a.lastLoginAt(), a.createdAt());
        replace(u);
        return u;
    }

    public Optional<Administrator> find(String id) { return admins.stream().filter(a -> a.id().equals(id)).findFirst(); }

    private void replace(Administrator a) {
        for (int i = 0; i < admins.size(); i++) {
            if (admins.get(i).id().equals(a.id())) { admins.set(i, a); break; }
        }
    }

    public Administrator getById(String id) { return find(id).orElseThrow(() -> new IllegalArgumentException("Admin not found")); }
}
