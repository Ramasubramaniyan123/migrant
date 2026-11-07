package com.migrantcommunity.moderation.repository;

import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;
import com.migrantcommunity.moderation.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    Page<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);
    
    Page<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId, Pageable pageable);
    
    Page<Report> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(ReportTargetType targetType, 
                                                                 Long targetId, 
                                                                 Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    long countByStatus(@Param("status") ReportStatus status);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reporter.id = :reporterId")
    long countByReporterId(@Param("reporterId") Long reporterId);
    
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Report r " +
           "WHERE r.reporter.id = :reporterId AND r.targetType = :targetType " +
           "AND r.targetId = :targetId AND r.status = 'PENDING'")
    boolean existsPendingReportByReporterAndTarget(@Param("reporterId") Long reporterId,
                                                   @Param("targetType") ReportTargetType targetType,
                                                   @Param("targetId") Long targetId);
}
