package com.migrantcommunity.post.controller;

import com.migrantcommunity.post.dto.PostResponse;
import com.migrantcommunity.post.service.PostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** REST entry point for post endpoints. */
@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/feed")
    public List<PostResponse> feed() {
        return postService.feed();
    }

    @PostMapping("/create")
    public PostResponse createPost(@RequestBody Map<String, String> payload) {
        return postService.create(
                payload.get("authorId"),
                payload.get("communityId"),
                payload.get("content"));
    }
}
