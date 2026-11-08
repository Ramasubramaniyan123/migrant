package com.migrantcommunity.connection.controller;

import com.migrantcommunity.common.enums.ConnectionStatus;
import com.migrantcommunity.common.response.ApiResponse;
import com.migrantcommunity.common.response.PageResult;
import com.migrantcommunity.connection.dto.ConnectionResponse;
import com.migrantcommunity.connection.dto.SendConnectionRequestRequest;
import com.migrantcommunity.connection.service.ConnectionService;
import com.migrantcommunity.security.CustomUserDetails;
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

@RestController
@RequestMapping("/v1/connections")
@Tag(name = "Connections", description = "Connection management endpoints")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping("/request")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Send connection request")
    public ResponseEntity<ApiResponse<ConnectionResponse>> sendRequest(
            @Valid @RequestBody SendConnectionRequestRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        ConnectionResponse response = connectionService.sendConnectionRequest(
            principal.getUser().getId(),
            request.receiverId()
        );
        
        return ResponseEntity.ok(ApiResponse.ok(response, "Connection request sent"));
    }

    @PostMapping("/{connectionId}/accept")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Accept connection request")
    public ResponseEntity<ApiResponse<ConnectionResponse>> acceptRequest(
            @PathVariable Long connectionId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        ConnectionResponse response = connectionService.acceptConnectionRequest(
            connectionId,
            principal.getUser().getId()
        );
        
        return ResponseEntity.ok(ApiResponse.ok(response, "Connection request accepted"));
    }

    @PostMapping("/{connectionId}/reject")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Reject connection request")
    public ResponseEntity<ApiResponse<ConnectionResponse>> rejectRequest(
            @PathVariable Long connectionId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        ConnectionResponse response = connectionService.rejectConnectionRequest(
            connectionId,
            principal.getUser().getId()
        );
        
        return ResponseEntity.ok(ApiResponse.ok(response, "Connection request rejected"));
    }

    @DeleteMapping("/{connectionId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel connection request")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(
            @PathVariable Long connectionId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        connectionService.cancelConnectionRequest(connectionId, principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(null, "Connection request cancelled"));
    }

    @DeleteMapping("/{connectionId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove connection")
    public ResponseEntity<ApiResponse<Void>> removeConnection(
            @PathVariable Long connectionId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        connectionService.removeConnection(connectionId, principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(null, "Connection removed"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my connections")
    public ResponseEntity<ApiResponse<PageResult<ConnectionResponse>>> getMyConnections(
            @RequestParam(required = false) ConnectionStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        Page<ConnectionResponse> connections = connectionService.getMyConnections(
            principal.getUser().getId(),
            status,
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.ok(
            PageResult.of(connections.getContent(), connections.getNumber(), 
                         connections.getSize(), connections.getTotalElements()),
            "Connections retrieved"
        ));
    }

    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get pending connection requests")
    public ResponseEntity<ApiResponse<PageResult<ConnectionResponse>>> getPendingRequests(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        Page<ConnectionResponse> requests = connectionService.getPendingRequests(
            principal.getUser().getId(),
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.ok(
            PageResult.of(requests.getContent(), requests.getNumber(), 
                         requests.getSize(), requests.getTotalElements()),
            "Pending requests retrieved"
        ));
    }

    @GetMapping("/sent")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get sent connection requests")
    public ResponseEntity<ApiResponse<PageResult<ConnectionResponse>>> getSentRequests(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        Page<ConnectionResponse> requests = connectionService.getSentRequests(
            principal.getUser().getId(),
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.ok(
            PageResult.of(requests.getContent(), requests.getNumber(), 
                         requests.getSize(), requests.getTotalElements()),
            "Sent requests retrieved"
        ));
    }

    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get connection count")
    public ResponseEntity<ApiResponse<Long>> getConnectionCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        long count = connectionService.getConnectionCount(principal.getUser().getId());
        
        return ResponseEntity.ok(ApiResponse.ok(count, "Connection count retrieved"));
    }

    @GetMapping("/check/{userId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check if connected with user")
    public ResponseEntity<ApiResponse<Boolean>> checkConnection(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        boolean connected = connectionService.areUsersConnected(
            principal.getUser().getId(),
            userId
        );
        
        return ResponseEntity.ok(ApiResponse.ok(connected, "Connection status checked"));
    }
}
