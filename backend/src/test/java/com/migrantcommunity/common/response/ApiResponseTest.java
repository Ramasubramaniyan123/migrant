package com.migrantcommunity.common.response;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiResponseTest {

    @Test
    void serializesSuccessAndErrorTimestampsAsIso8601Strings() throws Exception {
        JsonMapper mapper = JsonMapper.builder().build();

        assertTimestampIsIso8601(mapper, ApiResponse.ok(null));
        assertTimestampIsIso8601(mapper, ApiResponse.error("Invalid credentials"));
    }

    private static void assertTimestampIsIso8601(JsonMapper mapper, ApiResponse<?> response) throws Exception {
        JsonNode timestamp = mapper.readTree(mapper.writeValueAsString(response)).get("timestamp");
        assertTrue(timestamp.asString().endsWith("Z"));
    }
}
