package com.migrantcommunity.event.service;

import com.migrantcommunity.common.enums.EventStatus;
import com.migrantcommunity.community.entity.Community;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.event.dto.CommunityEvent;
import com.migrantcommunity.event.dto.EventParticipant;
import com.migrantcommunity.event.repository.CommunityEventRepository;
import com.migrantcommunity.event.repository.EventParticipantRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AdminEventService {

    private final CommunityEventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public AdminEventService(CommunityEventRepository eventRepository,
                             EventParticipantRepository participantRepository,
                             CommunityRepository communityRepository,
                             UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommunityEvent> list() {
        return eventRepository.findAll().stream()
                .sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime()))
                .map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CommunityEvent getById(String id) {
        return toDto(getEntity(id));
    }

    public CommunityEvent create(CommunityEvent payload) {
        com.migrantcommunity.event.entity.CommunityEvent entity =
                new com.migrantcommunity.event.entity.CommunityEvent();
        applyPayload(entity, payload);
        return toDto(eventRepository.save(entity));
    }

    public CommunityEvent update(String id, CommunityEvent payload) {
        com.migrantcommunity.event.entity.CommunityEvent entity = getEntity(id);
        applyPayload(entity, payload);
        return toDto(eventRepository.save(entity));
    }

    public void delete(String id) {
        eventRepository.delete(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<EventParticipant> participants(String eventId) {
        Long eid = parseId(eventId);
        return participantRepository.findByEventId(eid, Pageable.unpaged()).getContent().stream()
                .map(this::toParticipantDto).toList();
    }

    private void applyPayload(com.migrantcommunity.event.entity.CommunityEvent entity, CommunityEvent payload) {
        if (payload.title() != null) entity.setTitle(payload.title());
        if (payload.description() != null) entity.setDescription(payload.description());
        if (payload.location() != null) entity.setLocation(payload.location());
        if (payload.communityId() != null) {
            entity.setCommunity(communityRepository.findById(parseId(payload.communityId())).orElse(null));
        }
        if (payload.organizerId() != null) {
            entity.setOrganizer(userRepository.findById(parseId(payload.organizerId())).orElse(null));
        }
        if (payload.startsAt() != null) entity.setStartTime(Instant.parse(payload.startsAt()));
        if (payload.endsAt() != null) entity.setEndTime(Instant.parse(payload.endsAt()));
        if (payload.capacity() != null) entity.setMaxParticipants(payload.capacity());
        if (payload.status() != null) entity.setStatus(payload.status());
    }

    private com.migrantcommunity.event.entity.CommunityEvent getEntity(String id) {
        return eventRepository.findById(parseId(id))
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Event not found");
        }
    }

    private CommunityEvent toDto(com.migrantcommunity.event.entity.CommunityEvent e) {
        Community community = e.getCommunity();
        User organizer = e.getOrganizer();
        return new CommunityEvent(
                String.valueOf(e.getId()),
                e.getTitle(),
                e.getDescription(),
                community != null ? String.valueOf(community.getId()) : null,
                community != null ? community.getName() : null,
                e.getLocation(),
                community != null ? community.getLocationCity() : null,
                e.getStartTime() != null ? e.getStartTime().toString() : null,
                e.getEndTime() != null ? e.getEndTime().toString() : null,
                e.getMaxParticipants(),
                participantRepository.countAttendingByEventId(e.getId()),
                e.getStatus(),
                organizer != null ? String.valueOf(organizer.getId()) : null,
                organizer != null ? displayName(organizer) : null,
                null,
                e.getCreatedAt() != null ? e.getCreatedAt().toString() : null);
    }

    private EventParticipant toParticipantDto(com.migrantcommunity.event.entity.EventParticipant p) {
        User user = p.getUser();
        return new EventParticipant(
                String.valueOf(p.getId()),
                String.valueOf(p.getEvent().getId()),
                user != null ? String.valueOf(user.getId()) : null,
                user != null ? displayName(user) : "Unknown",
                p.getStatus(),
                p.getJoinedAt() != null ? p.getJoinedAt().toString() : null);
    }

    private String displayName(User user) {
        Profile profile = user.getProfile();
        if (profile != null && profile.getFirstName() != null) {
            return profile.getFirstName() + (profile.getLastName() != null ? " " + profile.getLastName() : "");
        }
        return user.getEmail();
    }
}
