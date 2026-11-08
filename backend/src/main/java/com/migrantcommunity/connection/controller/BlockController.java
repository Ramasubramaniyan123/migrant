package com.migrantcommunity.connection.controller;

import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.connection.entity.Block;
import com.migrantcommunity.connection.repository.BlockRepository;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** User-facing block/unblock endpoints. */
@RestController
@RequestMapping("/v1/blocks")
public class BlockController {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    public BlockController(BlockRepository blockRepository, UserRepository userRepository,
                           CurrentUserProvider currentUserProvider) {
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> block(@RequestBody Map<String, Object> body) {
        User me = currentUserProvider.requireUser();
        Long blockedId = ((Number) body.get("userId")).longValue();
        if (me.getId().equals(blockedId)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cannot block yourself"));
        }
        User blocked = userRepository.findById(blockedId).orElse(null);
        if (blocked == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        }
        if (!blockRepository.existsByBlockerIdAndBlockedId(me.getId(), blockedId)) {
            Block block = new Block(me, blocked, (String) body.get("reason"));
            blockRepository.save(block);
        }
        return ResponseEntity.ok(ApiResponse.ok(null, "User blocked"));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> unblock(@PathVariable Long userId) {
        blockRepository.deleteByBlockerIdAndBlockedId(currentUserProvider.requireUserId(), userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "User unblocked"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?> > listBlocked() {
        return ResponseEntity.ok(ApiResponse.ok(
                blockRepository.findBlockedUserIdsByBlockerId(currentUserProvider.requireUserId()),
                "Blocked users"));
    }
}
