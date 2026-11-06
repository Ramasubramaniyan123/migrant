package com.migrantcommunity.notification.service;

import com.migrantcommunity.common.enums.BroadcastAudience;
import com.migrantcommunity.common.enums.PlatformNotificationType;
import com.migrantcommunity.notification.dto.PlatformNotification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminNotificationService {
    private final List<PlatformNotification> notifications = new ArrayList<>();
    public AdminNotificationService() { seed(); }
    private void seed() {
        notifications.add(new PlatformNotification("notif_1","Welcome","Welcome to platform",PlatformNotificationType.ANNOUNCEMENT,BroadcastAudience.ALL,"adm_001","2025-01-01T09:00:00Z",4745,"SENT"));
    }
    public List<PlatformNotification> list() { return new ArrayList<>(notifications); }
    public PlatformNotification broadcast(String title,String body,PlatformNotificationType type,BroadcastAudience audience) {
        PlatformNotification n = new PlatformNotification("notif_"+(notifications.size()+1),title,body,type,audience,"adm_001",java.time.Instant.now().toString(),4700,"SENT");
        notifications.add(n); return n;
    }
    public List<PlatformNotification> history() { return new ArrayList<>(notifications); }
}
