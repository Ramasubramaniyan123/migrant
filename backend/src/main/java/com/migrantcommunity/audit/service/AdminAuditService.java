package com.migrantcommunity.audit.service;

import com.migrantcommunity.audit.dto.AuditLog;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminAuditService {
    private final List<AuditLog> logs = new ArrayList<>();
    public AdminAuditService() { seed(); }
    private void seed() {
        logs.add(new AuditLog("log_1","adm_001","Super Admin","SUPER_ADMIN","SUSPEND_USER","USER","usr_5","Suspended for abuse","127.0.0.1","SUCCESS","2025-01-01T09:00:00Z"));
        logs.add(new AuditLog("log_2","adm_003","Moderator","MODERATOR","REMOVE_CONTENT","POST","post_2","Removed flagged post","127.0.0.1","SUCCESS","2025-01-01T08:00:00Z"));
    }
    public List<AuditLog> list() { return new ArrayList<>(logs); }
    public void record(String adminId,String adminName,String adminRole,String action,String targetType,String targetId,String details,String result) {
        logs.add(new AuditLog("log_"+(logs.size()+1),adminId,adminName,adminRole,action,targetType,targetId,details,"127.0.0.1",result,java.time.Instant.now().toString()));
    }
}
