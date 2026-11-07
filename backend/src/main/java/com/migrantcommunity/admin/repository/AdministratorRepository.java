package com.migrantcommunity.admin.repository;

import com.migrantcommunity.admin.entity.Administrator;
import com.migrantcommunity.common.enums.AdminRole;
import com.migrantcommunity.common.enums.AdminStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    
    Optional<Administrator> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Page<Administrator> findByStatusOrderByCreatedAtDesc(AdminStatus status, Pageable pageable);
    
    Page<Administrator> findByRoleOrderByCreatedAtDesc(AdminRole role, Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Administrator a WHERE a.status = :status")
    long countByStatus(@Param("status") AdminStatus status);
    
    @Query("SELECT COUNT(a) FROM Administrator a WHERE a.role = :role")
    long countByRole(@Param("role") AdminRole role);
}
