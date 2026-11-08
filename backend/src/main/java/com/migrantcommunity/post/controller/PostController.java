package com.migrantcommunity.post.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.post.dto.CommentResponse;
import com.migrantcommunity.post.dto.CreateCommentRequest;
import com.migrantcommunity.post.dto.CreatePostRequest;
import com.migrantcommunity.post.dto.PostDetailsResponse;
import com.migrantcommunity.post.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** REST entry point for post, comment and reaction endpoints. */
@RestController
@RequestMapping("/v1/posts")
@Tag(name = "Posts", description = "Community content")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/feed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<PostDetailsResponse>>> feed(
            @RequestParam(required = false) Long communityId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PostDetailsResponse> page = postService.feed(communityId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Feed retrieved"));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<PostDetailsResponse>>> mine(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PostDetailsResponse> page = postService.myPosts(pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Posts retrieved"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostDetailsResponse>> details(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(postService.details(id), "Post retrieved"));
    }

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostDetailsResponse>> create(@Valid @RequestBody CreatePostRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(postService.create(request), "Post created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostDetailsResponse>> update(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(
                postService.update(id, body.get("content"), body.get("imageUrl")), "Post updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Post deleted"));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResult<CommentResponse>>> comments(
            @PathVariable Long id, @PageableDefault(size = 50) Pageable pageable) {
        Page<CommentResponse> page = postService.comments(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Comments retrieved"));
    }

    @PostMapping("/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(@Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(postService.addComment(request), "Comment added"));
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long commentId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(postService.updateComment(commentId, body.get("content")), "Comment updated"));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long commentId) {
        postService.deleteComment(commentId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Comment deleted"));
    }

    @PostMapping("/{id}/reactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> react(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        postService.react(id, body != null ? body.get("type") : null);
        return ResponseEntity.ok(ApiResponse.ok(null, "Reaction added"));
    }

    @DeleteMapping("/{id}/reactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> unreact(@PathVariable Long id) {
        postService.unreact(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Reaction removed"));
    }
}
