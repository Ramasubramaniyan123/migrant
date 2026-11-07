package com.migrantcommunity.audit.repository;

import com.migrantcommunity.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByAdminIdOrderByCreatedAtDesc(Long adminId, Pageable pageable);
    
    Page<AuditLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);
    
    Page<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, 
                                                                   Long entityId, 
                                                                   Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.createdAt >= :from ORDER BY al.createdAt DESC")
    Page<AuditLog> findRecentLogs(@Param("from") java.time.Instant from, Pageable pageable);
}
