package com.migrantcommunity.admin.dto;

/** Aggregate platform statistics shown on the admin dashboard. */
public record AdminResponse(long totalUsers, long totalCommunities, long pendingReports) {
}
