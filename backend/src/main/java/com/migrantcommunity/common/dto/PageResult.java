package com.migrantcommunity.common.dto;

public record PageResult<T>(java.util.List<T> items, long total, int page, int pageSize) {}