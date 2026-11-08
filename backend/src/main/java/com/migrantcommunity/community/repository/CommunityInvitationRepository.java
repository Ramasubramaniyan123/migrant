package com.migrantcommunity.community.repository;

import com.migrantcommunity.community.entity.CommunityInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityInvitationRepository extends JpaRepository<CommunityInvitation, Long> {
    List<CommunityInvitation> findByInviteeIdAndStatus(Long inviteeId, CommunityInvitation.Status status);
    Optional<CommunityInvitation> findByIdAndInviteeId(Long id, Long inviteeId);
    boolean existsByCommunityIdAndInviteeIdAndStatus(Long communityId, Long inviteeId, CommunityInvitation.Status status);
}
