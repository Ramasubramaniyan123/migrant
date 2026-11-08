package com.migrantcommunity.moderation.repository;

import com.migrantcommunity.moderation.entity.ContentFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentFlagRepository extends JpaRepository<ContentFlag, Long> {
    List<ContentFlag> findByStatusOrderByCreatedAtDesc(String status);
    boolean existsByTargetTypeAndTargetIdAndStatus(String targetType, Long targetId, String status);
}
