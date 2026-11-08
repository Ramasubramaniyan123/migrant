package com.migrantcommunity.community.service;

import com.migrantcommunity.common.enums.CommunityType;
import com.migrantcommunity.community.dto.Community;
import com.migrantcommunity.community.dto.CommunityMember;
import com.migrantcommunity.community.repository.CommunityMemberRepository;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminCommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository memberRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public AdminCommunityService(CommunityRepository communityRepository,
                                 CommunityMemberRepository memberRepository,
                                 PostRepository postRepository,
                                 UserRepository userRepository) {
        this.communityRepository = communityRepository;
        this.memberRepository = memberRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public static record CommunityListResult(List<Community> items, long total, int page, int pageSize) {}

    @Transactional(readOnly = true)
    public CommunityListResult list(String search, String type, String city, String status, int page, int pageSize) {
        String q = search == null ? "" : search.trim();
        CommunityType typeFilter = (type == null || "ALL".equals(type) || type.isBlank())
                ? null : CommunityType.valueOf(type);
        boolean activeFilter = "ACTIVE".equals(status);
        boolean inactiveFilter = "INACTIVE".equals(status);
        String cityFilter = (city == null || "ALL".equals(city)) ? null : city;

        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.max(1, pageSize));
        Page<com.migrantcommunity.community.entity.Community> result =
                communityRepository.searchForAdmin(q.isEmpty() ? null : q, typeFilter, cityFilter,
                        activeFilter, inactiveFilter, pageable);
        List<Community> items = result.getContent().stream().map(this::toDto).toList();
        return new CommunityListResult(items, result.getTotalElements(), page, pageSize);
    }

    @Transactional(readOnly = true)
    public Community getById(String id) {
        return toDto(getEntity(id));
    }

    public Community create(Community payload) {
        com.migrantcommunity.community.entity.Community entity = new com.migrantcommunity.community.entity.Community();
        applyPayload(entity, payload);
        entity.setMemberCount(0);
        entity.setPublicCommunity(true);
        if (entity.getType() == null) {
            entity.setType(payload.language() != null
                    ? CommunityType.LANGUAGE : CommunityType.HOMETOWN);
        }
        return toDto(communityRepository.save(entity));
    }

    public Community update(String id, Community payload) {
        com.migrantcommunity.community.entity.Community entity = getEntity(id);
        applyPayload(entity, payload);
        return toDto(communityRepository.save(entity));
    }

    public Community setActive(String id, boolean isActive) {
        com.migrantcommunity.community.entity.Community entity = getEntity(id);
        entity.setPublicCommunity(isActive);
        return toDto(communityRepository.save(entity));
    }

    public void delete(String id) {
        communityRepository.delete(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<CommunityMember> listMembers(String communityId) {
        Long cid = parseId(communityId);
        return memberRepository.findByCommunityId(cid, Pageable.unpaged()).getContent().stream()
                .map(this::toMemberDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CommunityStats getStats() {
        long total = communityRepository.count();
        long active = communityRepository.countByPublicCommunityTrue();
        long totalMembers = communityRepository.sumMemberCount();
        Map<String, Long> byType = communityRepository.countByType().stream()
                .collect(Collectors.toMap(
                        row -> row[0] == null ? "UNKNOWN" : row[0].toString(),
                        row -> ((Number) row[1]).longValue()));
        return new CommunityStats(total, active, totalMembers, byType);
    }

    public static record CommunityStats(long total, long active, long totalMembers, Map<String, Long> byType) {}

    private void applyPayload(com.migrantcommunity.community.entity.Community entity, Community payload) {
        if (payload.name() != null) entity.setName(payload.name());
        if (payload.description() != null) entity.setDescription(payload.description());
        if (payload.type() != null) entity.setType(payload.type());
        if (payload.hometown() != null) entity.setHometown(payload.hometown());
        if (payload.city() != null) entity.setLocationCity(payload.city());
        if (payload.isActive()) entity.setPublicCommunity(true);
    }

    private com.migrantcommunity.community.entity.Community getEntity(String id) {
        return communityRepository.findById(parseId(id))
                .orElseThrow(() -> new IllegalArgumentException("Community not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Community not found");
        }
    }

    private Community toDto(com.migrantcommunity.community.entity.Community c) {
        User creator = c.getCreatedBy();
        String creatorName = null;
        if (creator != null) {
            Profile profile = creator.getProfile();
            creatorName = profile != null && profile.getFirstName() != null
                    ? profile.getFirstName() + (profile.getLastName() != null ? " " + profile.getLastName() : "")
                    : creator.getEmail();
        }
        return new Community(
                String.valueOf(c.getId()),
                c.getName(),
                c.getDescription(),
                c.getType() != null ? c.getType()
                        : (c.getLanguage() != null ? CommunityType.LANGUAGE : CommunityType.HOMETOWN),
                c.getLanguage() != null ? c.getLanguage().getName() : null,
                c.getHometown(),
                c.getLocationCity(),
                c.getMemberCount(),
                postRepository.countByCommunityId(c.getId()),
                c.isPublicCommunity(),
                creatorName,
                c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
    }

    private CommunityMember toMemberDto(com.migrantcommunity.community.entity.CommunityMember m) {
        User user = m.getUser();
        Profile profile = user != null ? user.getProfile() : null;
        String name = profile != null && profile.getFirstName() != null
                ? profile.getFirstName() + (profile.getLastName() != null ? " " + profile.getLastName() : "")
                : (user != null ? user.getEmail() : "Unknown");
        return new CommunityMember(
                String.valueOf(m.getId()),
                String.valueOf(m.getCommunity().getId()),
                String.valueOf(user != null ? user.getId() : ""),
                name,
                m.getRole(),
                m.getJoinedAt() != null ? m.getJoinedAt().toString() : null);
    }
}
