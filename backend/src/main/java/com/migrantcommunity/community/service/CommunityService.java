package com.migrantcommunity.community.service;

import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.community.dto.CommunityDetailsResponse;
import com.migrantcommunity.community.dto.CommunityResponse;
import com.migrantcommunity.community.dto.CreateCommunityRequest;
import com.migrantcommunity.community.dto.UpdateCommunityRequest;
import com.migrantcommunity.community.entity.Community;
import com.migrantcommunity.community.entity.CommunityInvitation;
import com.migrantcommunity.community.entity.CommunityMember;
import com.migrantcommunity.community.repository.CommunityInvitationRepository;
import com.migrantcommunity.community.repository.CommunityMemberRepository;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.language.entity.Language;
import com.migrantcommunity.language.repository.LanguageRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommunityService {

    public static final String ROLE_OWNER = "OWNER";
    public static final String ROLE_MODERATOR = "MODERATOR";
    public static final String ROLE_MEMBER = "MEMBER";

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository memberRepository;
    private final CommunityInvitationRepository invitationRepository;
    private final LanguageRepository languageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    public CommunityService(CommunityRepository communityRepository,
                            CommunityMemberRepository memberRepository,
                            CommunityInvitationRepository invitationRepository,
                            LanguageRepository languageRepository,
                            UserRepository userRepository,
                            NotificationService notificationService,
                            CurrentUserProvider currentUserProvider) {
        this.communityRepository = communityRepository;
        this.memberRepository = memberRepository;
        this.invitationRepository = invitationRepository;
        this.languageRepository = languageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public Page<CommunityResponse> list(String query, Pageable pageable) {
        Page<Community> page = (query == null || query.isBlank())
                ? communityRepository.findByPublicCommunityTrue(pageable)
                : communityRepository.searchPublicCommunities(query, pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<CommunityResponse> myCommunities(Pageable pageable) {
        User me = currentUserProvider.requireUser();
        return memberRepository.findByUserId(me.getId(), pageable)
                .map(cm -> toResponse(cm.getCommunity()));
    }

    @Transactional(readOnly = true)
    public CommunityDetailsResponse details(Long communityId) {
        Community community = getCommunity(communityId);
        User me = currentUserProvider.requireUser();
        CommunityMember membership = memberRepository
                .findByCommunityIdAndUserId(communityId, me.getId()).orElse(null);
        requireVisibility(community, membership);
        return toDetails(community, membership);
    }

    public CommunityDetailsResponse create(CreateCommunityRequest request) {
        User me = currentUserProvider.requireUser();
        Language language = request.languageId() != null
                ? languageRepository.findById(request.languageId())
                        .orElseThrow(() -> new ResourceNotFoundException("Language", "id", request.languageId()))
                : null;
        Community community = new Community();
        community.setName(request.name().trim());
        community.setDescription(request.description());
        community.setLanguage(language);
        community.setLocationCountry(request.locationCountry());
        community.setLocationCity(request.locationCity());
        community.setPublicCommunity(request.publicCommunity() == null || request.publicCommunity());
        community.setType(language != null
                ? com.migrantcommunity.common.enums.CommunityType.LANGUAGE
                : com.migrantcommunity.common.enums.CommunityType.HOMETOWN);
        community.setCreatedBy(me);
        community.setMemberCount(1);
        community = communityRepository.save(community);

        CommunityMember owner = new CommunityMember(community, me, ROLE_OWNER);
        memberRepository.save(owner);
        return toDetails(community, owner);
    }

    public CommunityDetailsResponse update(Long communityId, UpdateCommunityRequest request) {
        Community community = getCommunity(communityId);
        requireManager(community);
        if (request.name() != null) community.setName(request.name().trim());
        if (request.description() != null) community.setDescription(request.description());
        if (request.locationCountry() != null) community.setLocationCountry(request.locationCountry());
        if (request.locationCity() != null) community.setLocationCity(request.locationCity());
        if (request.publicCommunity() != null) community.setPublicCommunity(request.publicCommunity());
        if (request.languageId() != null) {
            community.setLanguage(languageRepository.findById(request.languageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Language", "id", request.languageId())));
        }
        return toDetails(communityRepository.save(community), currentMembership(communityId));
    }

    public void archive(Long communityId) {
        Community community = getCommunity(communityId);
        requireOwner(community);
        community.setPublicCommunity(false);
        communityRepository.save(community);
    }

    public void delete(Long communityId) {
        Community community = getCommunity(communityId);
        requireOwner(community);
        communityRepository.delete(community);
    }

    public void join(Long communityId) {
        Community community = getCommunity(communityId);
        User me = currentUserProvider.requireUser();
        if (!community.isPublicCommunity()) {
            throw new BadRequestException("This is a private community; request an invitation instead");
        }
        if (memberRepository.existsByCommunityIdAndUserId(communityId, me.getId())) {
            throw new BadRequestException("Already a member");
        }
        CommunityMember member = new CommunityMember(community, me, ROLE_MEMBER);
        memberRepository.save(member);
        community.incrementMemberCount();
        communityRepository.save(community);
    }

    public void leave(Long communityId) {
        User me = currentUserProvider.requireUser();
        CommunityMember member = memberRepository.findByCommunityIdAndUserId(communityId, me.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "communityId", communityId));
        if (ROLE_OWNER.equals(member.getRole())) {
            throw new BadRequestException("Owners must transfer ownership or delete the community first");
        }
        memberRepository.delete(member);
        Community community = member.getCommunity();
        community.decrementMemberCount();
        communityRepository.save(community);
    }

    public void removeMember(Long communityId, Long userId) {
        Community community = getCommunity(communityId);
        requireManager(community);
        CommunityMember member = memberRepository.findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "userId", userId));
        if (ROLE_OWNER.equals(member.getRole())) {
            throw new BadRequestException("Cannot remove the community owner");
        }
        memberRepository.delete(member);
        community.decrementMemberCount();
        communityRepository.save(community);
    }

    public void setMemberRole(Long communityId, Long userId, String role) {
        Community community = getCommunity(communityId);
        requireOwner(community);
        if (!List.of(ROLE_MODERATOR, ROLE_MEMBER).contains(role)) {
            throw new BadRequestException("Invalid role: " + role);
        }
        CommunityMember member = memberRepository.findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member", "userId", userId));
        member.setRole(role);
        memberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public Page<CommunityDetailsResponse.MemberInfo> members(Long communityId, Pageable pageable) {
        Community community = getCommunity(communityId);
        CommunityMember membership = currentMembership(communityId);
        requireVisibility(community, membership);
        return memberRepository.findByCommunityId(communityId, pageable)
                .map(cm -> new CommunityDetailsResponse.MemberInfo(
                        cm.getUser().getId(), displayName(cm.getUser()), cm.getRole(), cm.getJoinedAt()));
    }

    public void invite(Long communityId, Long inviteeId) {
        Community community = getCommunity(communityId);
        User inviter = currentUserProvider.requireUser();
        requireManager(community);
        User invitee = userRepository.findById(inviteeId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", inviteeId));
        if (memberRepository.existsByCommunityIdAndUserId(communityId, inviteeId)) {
            throw new BadRequestException("User is already a member");
        }
        if (invitationRepository.existsByCommunityIdAndInviteeIdAndStatus(
                communityId, inviteeId, CommunityInvitation.Status.PENDING)) {
            throw new BadRequestException("Invitation already pending");
        }
        CommunityInvitation invitation = new CommunityInvitation();
        invitation.setCommunity(community);
        invitation.setInviter(inviter);
        invitation.setInvitee(invitee);
        invitationRepository.save(invitation);
        notificationService.createNotification(
                inviteeId, NotificationType.COMMUNITY_INVITE,
                "Community invitation",
                displayName(inviter) + " invited you to " + community.getName(),
                community.getId());
    }

    public void respondToInvitation(Long invitationId, boolean accept) {
        User me = currentUserProvider.requireUser();
        CommunityInvitation invitation = invitationRepository
                .findByIdAndInviteeId(invitationId, me.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invitation", "id", invitationId));
        if (invitation.getStatus() != CommunityInvitation.Status.PENDING) {
            throw new BadRequestException("Invitation is no longer pending");
        }
        if (!accept) {
            invitation.setStatus(CommunityInvitation.Status.DECLINED);
            invitationRepository.save(invitation);
            return;
        }
        Community community = invitation.getCommunity();
        if (!memberRepository.existsByCommunityIdAndUserId(community.getId(), me.getId())) {
            memberRepository.save(new CommunityMember(community, me, ROLE_MEMBER));
            community.incrementMemberCount();
            communityRepository.save(community);
        }
        invitation.setStatus(CommunityInvitation.Status.ACCEPTED);
        invitationRepository.save(invitation);
    }

    @Transactional(readOnly = true)
    public List<CommunityDetailsResponse.InvitationInfo> myInvitations() {
        User me = currentUserProvider.requireUser();
        return invitationRepository
                .findByInviteeIdAndStatus(me.getId(), CommunityInvitation.Status.PENDING)
                .stream()
                .map(inv -> new CommunityDetailsResponse.InvitationInfo(
                        inv.getId(), inv.getCommunity().getId(), displayName(inv.getInviter()),
                        inv.getInvitee() != null ? inv.getInvitee().getId() : null,
                        inv.getInviteeEmail(), inv.getStatus().name()))
                .toList();
    }

    private Community getCommunity(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", id));
    }

    /** Private communities are only visible to their members. */
    private void requireVisibility(Community community, CommunityMember membership) {
        if (!community.isPublicCommunity() && membership == null) {
            throw new ForbiddenException("This is a private community");
        }
    }

    private CommunityMember currentMembership(Long communityId) {
        User me = currentUserProvider.requireUser();
        return memberRepository.findByCommunityIdAndUserId(communityId, me.getId()).orElse(null);
    }

    private void requireManager(Community community) {
        CommunityMember member = currentMembership(community.getId());
        if (member == null || !(ROLE_OWNER.equals(member.getRole()) || ROLE_MODERATOR.equals(member.getRole()))) {
            throw new ForbiddenException("Only community owners and moderators can manage this community");
        }
    }

    private void requireOwner(Community community) {
        CommunityMember member = currentMembership(community.getId());
        if (member == null || !ROLE_OWNER.equals(member.getRole())) {
            throw new ForbiddenException("Only the community owner can perform this action");
        }
    }

    private String displayName(User user) {
        Profile profile = user.getProfile();
        if (profile != null && profile.getFirstName() != null) {
            String name = profile.getFirstName();
            if (profile.getLastName() != null) name += " " + profile.getLastName();
            return name;
        }
        return user.getEmail().split("@")[0];
    }

    private CommunityResponse toResponse(Community c) {
        return new CommunityResponse(
                String.valueOf(c.getId()), c.getName(),
                c.getLanguage() != null ? c.getLanguage().getCode() : null,
                c.getMemberCount());
    }

    private CommunityDetailsResponse toDetails(Community c, CommunityMember membership) {
        User me = currentUserProvider.requireUser();
        return new CommunityDetailsResponse(
                c.getId(), c.getName(), c.getDescription(),
                c.getLanguage() != null ? c.getLanguage().getId() : null,
                c.getLanguage() != null ? c.getLanguage().getName() : null,
                c.getLocationCountry(), c.getLocationCity(),
                c.isPublicCommunity(), c.getMemberCount(),
                membership != null && membership.getUser().getId().equals(me.getId()),
                membership != null ? membership.getRole() : null,
                c.getCreatedAt());
    }
}
