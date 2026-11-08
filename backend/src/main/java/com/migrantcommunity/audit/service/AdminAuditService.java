package com.migrantcommunity.audit.service;

import com.migrantcommunity.admin.entity.Administrator;
import com.migrantcommunity.admin.repository.AdministratorRepository;
import com.migrantcommunity.audit.dto.AuditLog;
import com.migrantcommunity.audit.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminAuditService {

    private final AuditLogRepository auditLogRepository;
    private final AdministratorRepository administratorRepository;

    public AdminAuditService(AuditLogRepository auditLogRepository,
                             AdministratorRepository administratorRepository) {
        this.auditLogRepository = auditLogRepository;
        this.administratorRepository = administratorRepository;
    }

    @Transactional(readOnly = true)
    public List<AuditLog> list() {
        return auditLogRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(500)
                .map(this::toDto).toList();
    }

    public void record(String adminId, String adminName, String adminRole, String action,
                       String targetType, String targetId, String details, String result) {
        com.migrantcommunity.audit.entity.AuditLog log = new com.migrantcommunity.audit.entity.AuditLog();
        if (adminId != null) {
            try {
                log.setAdmin(administratorRepository.findById(Long.parseLong(adminId)).orElse(null));
            } catch (NumberFormatException ignored) {
            }
        }
        log.setAction(action);
        log.setEntityType(targetType);
        if (targetId != null) {
            try {
                log.setEntityId(Long.parseLong(targetId));
            } catch (NumberFormatException ignored) {
            }
        }
        log.setDetails(details != null ? details : result);
        log.setResult(result);
        auditLogRepository.save(log);
    }

    private AuditLog toDto(com.migrantcommunity.audit.entity.AuditLog log) {
        Administrator admin = log.getAdmin();
        String adminName = admin != null
                ? ((admin.getFirstName() != null ? admin.getFirstName() : "")
                   + (admin.getLastName() != null ? " " + admin.getLastName() : "")).trim()
                : "System";
        return new AuditLog(
                String.valueOf(log.getId()),
                admin != null ? String.valueOf(admin.getId()) : null,
                adminName,
                admin != null ? admin.getRole().name() : null,
                log.getAction(),
                log.getEntityType(),
                log.getEntityId() != null ? String.valueOf(log.getEntityId()) : null,
                log.getDetails(),
                log.getIpAddress(),
                log.getResult(),
                log.getCreatedAt() != null ? log.getCreatedAt().toString() : null);
    }
}
