package com.migrantcommunity.community.repository;

import com.migrantcommunity.community.entity.CommunityMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
    
    Page<CommunityMember> findByCommunityId(Long communityId, Pageable pageable);
    
    Page<CommunityMember> findByUserId(Long userId, Pageable pageable);
    
    Optional<CommunityMember> findByCommunityIdAndUserId(Long communityId, Long userId);
    
    boolean existsByCommunityIdAndUserId(Long communityId, Long userId);
    
    @Query("SELECT cm.user.id FROM CommunityMember cm WHERE cm.community.id = :communityId")
    List<Long> findUserIdsByCommunityId(@Param("communityId") Long communityId);
    
    @Query("SELECT cm FROM CommunityMember cm WHERE cm.community.id = :communityId AND cm.role = :role")
    List<CommunityMember> findByCommunityIdAndRole(@Param("communityId") Long communityId, 
                                                    @Param("role") String role);
    
    long countByCommunityId(Long communityId);
    
    long countByUserId(Long userId);
    
    void deleteByCommunityIdAndUserId(Long communityId, Long userId);
}
