package com.migrantcommunity.post.service;

import com.migrantcommunity.post.dto.Post;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminPostService {
    private final List<Post> posts = new ArrayList<>();
    public AdminPostService() { seed(); }
    private void seed() {
        posts.add(new Post("post_1","usr_1","User 1","com_1","Mumbai Migrants","Hello Mumbai!",null,12,3,false,"2025-01-01T10:00:00Z"));
        posts.add(new Post("post_2","usr_2","User 2","com_1","Mumbai Migrants","Looking for roommates",null,5,1,true,"2025-01-02T10:00:00Z"));
        posts.add(new Post("post_3","usr_3","User 3","com_2","Tamil Sangam Delhi","Pongal event",null,20,8,false,"2025-01-03T10:00:00Z"));
    }
    public List<Post> list(String communityId) {
        if (communityId == null || communityId.isBlank()) return new ArrayList<>(posts);
        return posts.stream().filter(p -> p.communityId().equals(communityId)).collect(Collectors.toList());
    }
    public List<Post> flagged() { return posts.stream().filter(Post::isFlagged).collect(Collectors.toList()); }
    public Post getById(String id) { return posts.stream().filter(p -> p.id().equals(id)).findFirst().orElseThrow(() -> new IllegalArgumentException("Post not found")); }
    public void remove(String id) { if (!posts.removeIf(p -> p.id().equals(id))) throw new IllegalArgumentException("Post not found"); }
}
