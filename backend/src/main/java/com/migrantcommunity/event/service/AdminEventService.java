package com.migrantcommunity.event.service;

import com.migrantcommunity.common.enums.EventStatus;
import com.migrantcommunity.event.dto.CommunityEvent;
import com.migrantcommunity.event.dto.EventParticipant;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminEventService {
    private final List<CommunityEvent> events = new ArrayList<>();
    private final List<EventParticipant> participants = new ArrayList<>();

    public AdminEventService() { seed(); }
    private void seed() {
        events.add(new CommunityEvent("evt_1","Pongal Celebration","Festival","com_2","Tamil Sangam Delhi","Community Hall","Delhi","2025-01-14T10:00:00Z","2025-01-14T18:00:00Z",200,45,EventStatus.UPCOMING,"usr_2","User 2",null,"2024-12-01T00:00:00Z"));
        events.add(new CommunityEvent("evt_2","Mumbai Meetup","Networking","com_1","Mumbai Migrants","Park","Mumbai","2025-01-20T10:00:00Z","2025-01-20T14:00:00Z",100,30,EventStatus.UPCOMING,"usr_1","User 1",null,"2024-12-02T00:00:00Z"));
    }
    public List<CommunityEvent> list() { return new ArrayList<>(events); }
    public CommunityEvent getById(String id) { return events.stream().filter(e -> e.id().equals(id)).findFirst().orElseThrow(() -> new IllegalArgumentException("Event not found")); }
    public CommunityEvent create(CommunityEvent p) {
        CommunityEvent e = new CommunityEvent("evt_"+(events.size()+1), p.title(), p.description(), p.communityId(), p.communityName(), p.location(), p.city(), p.startsAt(), p.endsAt(), p.capacity(), 0, EventStatus.UPCOMING, p.organizerId(), p.organizerName(), p.imageUrl(), java.time.Instant.now().toString());
        events.add(e); return e;
    }
    public CommunityEvent update(String id, CommunityEvent p) {
        CommunityEvent e = getById(id);
        CommunityEvent u = new CommunityEvent(e.id(), p.title()!=null?p.title():e.title(), p.description()!=null?p.description():e.description(), p.communityId()!=null?p.communityId():e.communityId(), p.communityName()!=null?p.communityName():e.communityName(), p.location()!=null?p.location():e.location(), p.city()!=null?p.city():e.city(), p.startsAt()!=null?p.startsAt():e.startsAt(), p.endsAt()!=null?p.endsAt():e.endsAt(), p.capacity()!=null?p.capacity():e.capacity(), e.participantCount(), p.status()!=null?p.status():e.status(), e.organizerId(), e.organizerName(), p.imageUrl()!=null?p.imageUrl():e.imageUrl(), e.createdAt());
        replace(u); return u;
    }
    public void delete(String id) { if (!events.removeIf(e -> e.id().equals(id))) throw new IllegalArgumentException("Event not found"); }
    public List<EventParticipant> participants(String eventId) { return participants.stream().filter(p -> p.eventId().equals(eventId)).collect(Collectors.toList()); }
    private void replace(CommunityEvent e) { for (int i = 0; i < events.size(); i++) if (events.get(i).id().equals(e.id())) { events.set(i, e); break; } }
}
