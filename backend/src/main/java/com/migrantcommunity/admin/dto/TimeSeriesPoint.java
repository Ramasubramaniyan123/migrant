package com.migrantcommunity.admin.dto;

public record TimeSeriesPoint(String date, long users, long activeUsers, long posts, long connections) {}