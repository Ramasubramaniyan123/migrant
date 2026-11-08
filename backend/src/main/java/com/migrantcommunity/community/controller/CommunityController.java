package com.migrantcommunity.community.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.community.dto.*;
import com.migrantcommunity.community.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** REST entry point for community endpoints. */
@RestController
@RequestMapping("/v1/communities")
@Tag(name = "Communities", description = "Community discovery, membership and invitations")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List public communities")
    public ResponseEntity<ApiResponse<PageResult<CommunityResponse>>> list(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<CommunityResponse> page = communityService.list(query, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Communities retrieved"));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List communities the current user belongs to")
    public ResponseEntity<ApiResponse<PageResult<CommunityResponse>>> mine(
            @PageableDefault(size = 50) Pageable pageable) {
        Page<CommunityResponse> page = communityService.myCommunities(pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Communities retrieved"));
    }

    @GetMapping("/invitations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List pending invitations for the current user")
    public ResponseEntity<ApiResponse<List<CommunityDetailsResponse.InvitationInfo>>> myInvitations() {
        return ResponseEntity.ok(ApiResponse.ok(communityService.myInvitations(), "Invitations retrieved"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get community details")
    public ResponseEntity<ApiResponse<CommunityDetailsResponse>> details(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.details(id), "Community retrieved"));
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List community members")
    public ResponseEntity<ApiResponse<PageResult<CommunityDetailsResponse.MemberInfo>>> members(
            @PathVariable Long id, @PageableDefault(size = 50) Pageable pageable) {
        Page<CommunityDetailsResponse.MemberInfo> page = communityService.members(id, pageable);
        return ResponseEntity.ok(ApiResponse.ok(
                PageResult.of(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements()),
                "Members retrieved"));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a community")
    public ResponseEntity<ApiResponse<CommunityDetailsResponse>> create(
            @Valid @RequestBody CreateCommunityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.create(request), "Community created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a community")
    public ResponseEntity<ApiResponse<CommunityDetailsResponse>> update(
            @PathVariable Long id, @Valid @RequestBody UpdateCommunityRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(communityService.update(id, request), "Community updated"));
    }

    @PostMapping("/{id}/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> archive(@PathVariable Long id) {
        communityService.archive(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Community archived"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a community")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        communityService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Community deleted"));
    }

    @PostMapping("/{id}/join")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Join a public community")
    public ResponseEntity<ApiResponse<Void>> join(@PathVariable Long id) {
        communityService.join(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Joined community"));
    }

    @PostMapping("/{id}/leave")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Leave a community")
    public ResponseEntity<ApiResponse<Void>> leave(@PathVariable Long id) {
        communityService.leave(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Left community"));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove a member from a community")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable Long id, @PathVariable Long userId) {
        communityService.removeMember(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Member removed"));
    }

    @PatchMapping("/{id}/members/{userId}/role")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change a member's role")
    public ResponseEntity<ApiResponse<Void>> setMemberRole(
            @PathVariable Long id, @PathVariable Long userId, @RequestBody Map<String, String> body) {
        communityService.setMemberRole(id, userId, body.get("role"));
        return ResponseEntity.ok(ApiResponse.ok(null, "Role updated"));
    }

    @PostMapping("/{id}/invitations")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Invite a user to a community")
    public ResponseEntity<ApiResponse<Void>> invite(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        communityService.invite(id, body.get("userId"));
        return ResponseEntity.ok(ApiResponse.ok(null, "Invitation sent"));
    }

    @PostMapping("/invitations/{invitationId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(@PathVariable Long invitationId) {
        communityService.respondToInvitation(invitationId, true);
        return ResponseEntity.ok(ApiResponse.ok(null, "Invitation accepted"));
    }

    @PostMapping("/invitations/{invitationId}/decline")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> declineInvitation(@PathVariable Long invitationId) {
        communityService.respondToInvitation(invitationId, false);
        return ResponseEntity.ok(ApiResponse.ok(null, "Invitation declined"));
    }
}
