package com.migrantcommunity.event.service;

import com.migrantcommunity.common.enums.EventStatus;
import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.community.entity.Community;
import com.migrantcommunity.community.entity.CommunityMember;
import com.migrantcommunity.community.repository.CommunityMemberRepository;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.event.entity.CommunityEvent;
import com.migrantcommunity.event.entity.EventParticipant;
import com.migrantcommunity.event.repository.CommunityEventRepository;
import com.migrantcommunity.event.repository.EventParticipantRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class EventService {

    private final CommunityEventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository memberRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    public EventService(CommunityEventRepository eventRepository,
                        EventParticipantRepository participantRepository,
                        CommunityRepository communityRepository,
                        CommunityMemberRepository memberRepository,
                        NotificationService notificationService,
                        CurrentUserProvider currentUserProvider) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.communityRepository = communityRepository;
        this.memberRepository = memberRepository;
        this.notificationService = notificationService;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> upcoming(Long communityId, Pageable pageable) {
        User me = currentUserProvider.requireUser();
        Page<CommunityEvent> page;
        if (communityId != null) {
            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));
            requireCommunityAccess(community, me.getId());
            page = eventRepository.findUpcomingEventsByCommunityId(communityId, Instant.now(), pageable);
        } else {
            page = eventRepository.findVisibleUpcoming(me.getId(), pageable);
        }
        return page.map(e -> toResponse(e, me.getId()));
    }

    @Transactional(readOnly = true)
    public EventResponse details(Long eventId) {
        CommunityEvent event = getEvent(eventId);
        requireCommunityAccess(event.getCommunity(), currentUserProvider.requireUserId());
        return toResponse(event, currentUserProvider.requireUserId());
    }

    public EventResponse create(Long communityId, String title, String description, String location,
                                Instant startTime, Instant endTime, Integer maxParticipants) {
        User me = currentUserProvider.requireUser();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));
        requireCommunityManager(community);
        if (endTime != null && startTime != null && endTime.isBefore(startTime)) {
            throw new BadRequestException("endTime must be after startTime");
        }
        CommunityEvent event = new CommunityEvent();
        event.setCommunity(community);
        event.setOrganizer(me);
        event.setTitle(title);
        event.setDescription(description);
        event.setLocation(location);
        event.setStartTime(startTime);
        event.setEndTime(endTime);
        event.setMaxParticipants(maxParticipants);
        event.setStatus(EventStatus.UPCOMING);
        return toResponse(eventRepository.save(event), me.getId());
    }

    public EventResponse update(Long eventId, String title, String description, String location,
                                Instant startTime, Instant endTime, Integer maxParticipants) {
        CommunityEvent event = getEvent(eventId);
        requireOrganizer(event);
        if (title != null) event.setTitle(title);
        if (description != null) event.setDescription(description);
        if (location != null) event.setLocation(location);
        if (startTime != null) event.setStartTime(startTime);
        if (endTime != null) event.setEndTime(endTime);
        if (maxParticipants != null) event.setMaxParticipants(maxParticipants);
        return toResponse(eventRepository.save(event), currentUserProvider.requireUserId());
    }

    public void cancel(Long eventId) {
        CommunityEvent event = getEvent(eventId);
        requireOrganizer(event);
        event.setStatus(EventStatus.CANCELLED);
        eventRepository.save(event);
    }

    public void register(Long eventId) {
        User me = currentUserProvider.requireUser();
        // Lock the event row so concurrent registrations cannot overshoot capacity.
        CommunityEvent event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        requireCommunityAccess(event.getCommunity(), me.getId());
        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new BadRequestException("Event is not open for registration");
        }
        if (participantRepository.existsByEventIdAndUserId(eventId, me.getId())) {
            throw new BadRequestException("Already registered");
        }
        if (event.getMaxParticipants() != null
                && participantRepository.countAttendingByEventId(eventId) >= event.getMaxParticipants()) {
            throw new BadRequestException("Event is at capacity");
        }
        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(me);
        participant.setStatus("ATTENDING");
        try {
            participantRepository.save(participant);
            participantRepository.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException ex) {
            throw new BadRequestException("Already registered");
        }

        eventRepository.findById(eventId).ifPresent(this::notifyParticipants);
    }

    private void notifyParticipants(CommunityEvent event) {
        List<Long> userIds = participantRepository.findUserIdsByEventId(event.getId());
        userIds.stream()
                .filter(id -> !id.equals(event.getOrganizer().getId()))
                .forEach(uid -> notificationService.createNotification(
                        uid, NotificationType.EVENT,
                        "Event update", event.getTitle() + " has been updated", event.getId()));
    }

    public void cancelRegistration(Long eventId) {
        User me = currentUserProvider.requireUser();
        EventParticipant participant = participantRepository.findByEventIdAndUserId(eventId, me.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Registration", "eventId", eventId));
        participantRepository.delete(participant);
    }

    @Transactional(readOnly = true)
    public Page<EventResponse> myEvents(Pageable pageable) {
        User me = currentUserProvider.requireUser();
        return participantRepository.findByUserId(me.getId(), pageable)
                .map(p -> toResponse(p.getEvent(), me.getId()));
    }

    @Transactional(readOnly = true)
    public Page<ParticipantInfo> participants(Long eventId, Pageable pageable) {
        CommunityEvent event = getEvent(eventId);
        requireCommunityAccess(event.getCommunity(), currentUserProvider.requireUserId());
        return participantRepository.findByEventId(eventId, pageable)
                .map(p -> new ParticipantInfo(p.getUser().getId(), displayName(p.getUser()),
                        p.getStatus(), p.getJoinedAt()));
    }

    /** Private community events are only visible to community members. */
    private void requireCommunityAccess(Community community, Long userId) {
        if (!community.isPublicCommunity()
                && !memberRepository.existsByCommunityIdAndUserId(community.getId(), userId)) {
            throw new ForbiddenException("This is a private community");
        }
    }

    private CommunityEvent getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
    }

    private void requireOrganizer(CommunityEvent event) {
        if (!event.getOrganizer().getId().equals(currentUserProvider.requireUserId())) {
            throw new ForbiddenException("Only the organizer can modify this event");
        }
    }

    private void requireCommunityManager(Community community) {
        User me = currentUserProvider.requireUser();
        CommunityMember member = memberRepository.findByCommunityIdAndUserId(community.getId(), me.getId())
                .orElseThrow(() -> new ForbiddenException("You must be a community manager to create events"));
        if (!List.of("OWNER", "MODERATOR").contains(member.getRole())) {
            throw new ForbiddenException("Only community owners and moderators can create events");
        }
    }

    private String displayName(User user) {
        Profile p = user.getProfile();
        if (p != null && p.getFirstName() != null) {
            return p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : "");
        }
        return user.getEmail().split("@")[0];
    }

    private EventResponse toResponse(CommunityEvent e, Long viewerId) {
        boolean registered = participantRepository.existsByEventIdAndUserId(e.getId(), viewerId);
        int attending = (int) participantRepository.countAttendingByEventId(e.getId());
        return new EventResponse(
                e.getId(), e.getCommunity().getId(), e.getCommunity().getName(),
                e.getOrganizer().getId(), displayName(e.getOrganizer()),
                e.getTitle(), e.getDescription(), e.getLocation(),
                e.getStartTime(), e.getEndTime(), e.getMaxParticipants(),
                attending, registered, e.getStatus().name(),
                e.getCreatedAt());
    }

    public record EventResponse(
            Long id, Long communityId, String communityName,
            Long organizerId, String organizerName,
            String title, String description, String location,
            Instant startTime, Instant endTime, Integer maxParticipants,
            int attendingCount, boolean registered,
            String status, Instant createdAt) {
    }

    public record ParticipantInfo(Long userId, String displayName, String status, Instant joinedAt) {
    }
}
