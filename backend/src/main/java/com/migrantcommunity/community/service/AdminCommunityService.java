package com.migrantcommunity.community.service;

import com.migrantcommunity.common.enums.CommunityType;
import com.migrantcommunity.community.dto.Community;
import com.migrantcommunity.community.dto.CommunityMember;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminCommunityService {
    private final List<Community> communities = new ArrayList<>();
    private final List<CommunityMember> members = new ArrayList<>();

    public AdminCommunityService() { seed(); }
    private void seed() {
        communities.add(new Community("com_1","Mumbai Migrants","Community for migrants in Mumbai",CommunityType.LANGUAGE,"Hindi",null,"Mumbai",120,45,true,"usr_1","2024-10-01T00:00:00Z"));
        communities.add(new Community("com_2","Tamil Sangam Delhi","Tamil community in Delhi",CommunityType.LANGUAGE,"Tamil",null,"Delhi",80,22,true,"usr_2","2024-10-02T00:00:00Z"));
        communities.add(new Community("com_3","Lucknow Hometown","People from Lucknow",CommunityType.HOMETOWN,null,"Lucknow","Mumbai",60,12,true,"usr_3","2024-10-03T00:00:00Z"));
        communities.add(new Community("com_4","Tech Professionals","Workplace community",CommunityType.WORKPLACE,null,null,"Bengaluru",40,8,false,"usr_4","2024-10-04T00:00:00Z"));
        members.add(new CommunityMember("mem_1","com_1","usr_1","User 1","OWNER","2024-10-01T00:00:00Z"));
        members.add(new CommunityMember("mem_2","com_1","usr_2","User 2","MEMBER","2024-10-02T00:00:00Z"));
    }
    public static record CommunityListResult(List<Community> items,long total,int page,int pageSize){}
    public CommunityListResult list(String search,String type,String city,String status,int page,int pageSize){
        List<Community> items=new ArrayList<>(communities);
        String q=search==null?"":search.trim().toLowerCase();
        if(!q.isEmpty()) items=items.stream().filter(c->c.name().toLowerCase().contains(q)||c.description().toLowerCase().contains(q)).collect(Collectors.toList());
        if(type!=null && !"ALL".equals(type)) items=items.stream().filter(c->c.type().name().equals(type)).collect(Collectors.toList());
        if(city!=null && !"ALL".equals(city)) items=items.stream().filter(c->c.city().equals(city)).collect(Collectors.toList());
        if("ACTIVE".equals(status)) items=items.stream().filter(Community::isActive).collect(Collectors.toList());
        if("INACTIVE".equals(status)) items=items.stream().filter(c->!c.isActive()).collect(Collectors.toList());
        long total=items.size();
        int start=(page-1)*pageSize;
        return new CommunityListResult(items.stream().skip(start).limit(pageSize).collect(Collectors.toList()),total,page,pageSize);
    }
    public Community getById(String id){ return communities.stream().filter(c->c.id().equals(id)).findFirst().orElseThrow(()->new IllegalArgumentException("Community not found")); }
    public Community create(Community p){
        Community c=new Community("com_"+(communities.size()+1),p.name(),p.description(),p.type(),p.language(),p.hometown(),p.city(),1,0,true,p.createdBy()==null?"admin":p.createdBy(),java.time.Instant.now().toString());
        communities.add(c); return c;
    }
    public Community update(String id,Community p){
        Community c=getById(id);
        Community u=new Community(c.id(),p.name()!=null?p.name():c.name(),p.description()!=null?p.description():c.description(),p.type()!=null?p.type():c.type(),p.language()!=null?p.language():c.language(),p.hometown()!=null?p.hometown():c.hometown(),p.city()!=null?p.city():c.city(),c.memberCount(),c.postCount(),c.isActive(),c.createdBy(),c.createdAt());
        replace(u); return u;
    }
    public Community setActive(String id,boolean isActive){ Community c=getById(id); Community u=new Community(c.id(),c.name(),c.description(),c.type(),c.language(),c.hometown(),c.city(),c.memberCount(),c.postCount(),isActive,c.createdBy(),c.createdAt()); replace(u); return u; }
    public void delete(String id){ if(!communities.removeIf(c->c.id().equals(id))) throw new IllegalArgumentException("Community not found"); }
    public List<CommunityMember> listMembers(String communityId){ return members.stream().filter(m->m.communityId().equals(communityId)).collect(Collectors.toList()); }
    public static record CommunityStats(long total,long active,long totalMembers,java.util.Map<String,Long> byType){}
    public CommunityStats getStats(){
        long total=communities.size();
        long active=communities.stream().filter(Community::isActive).count();
        long totalMembers=communities.stream().mapToLong(Community::memberCount).sum();
        java.util.Map<String,Long> byType=communities.stream().collect(Collectors.groupingBy(c->c.type().name(),Collectors.counting()));
        return new CommunityStats(total,active,totalMembers,byType);
    }
    private void replace(Community c){ for(int i=0;i<communities.size();i++) if(communities.get(i).id().equals(c.id())){communities.set(i,c);break;} }
}
