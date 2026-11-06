package com.migrantcommunity.admin.controller;

import com.migrantcommunity.post.dto.Post;
import com.migrantcommunity.post.service.AdminPostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/posts")
public class AdminPostController {

    private final AdminPostService service;
    public AdminPostController(AdminPostService service) { this.service = service; }

    @GetMapping
    public List<Post> list(@RequestParam(required = false) String communityId) { return service.list(communityId); }

    @GetMapping("/{id}")
    public Post get(@PathVariable String id) { return service.getById(id); }

    @GetMapping("/flagged")
    public List<Post> flagged() { return service.flagged(); }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable String id) { service.remove(id); }
}
