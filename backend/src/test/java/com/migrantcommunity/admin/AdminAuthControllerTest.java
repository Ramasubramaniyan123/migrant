package com.migrantcommunity.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.migrantcommunity.admin.service.AdminJwtService;
import com.migrantcommunity.common.enums.AdminRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "admin.bootstrap.email=superadmin@migrantcommunity.com",
        "admin.bootstrap.password=test-admin-password-123",
        "jwt.secret=test-jwt-signing-secret-that-is-long-enough-123456"
})
@AutoConfigureMockMvc
class AdminAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminJwtService jwtService;

    @Test
    void loginReturnsOk() throws Exception {
        mockMvc.perform(post("/v1/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"superadmin@migrantcommunity.com\",\"password\":\"test-admin-password-123\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void adminEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/v1/admin/administrators"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointsAcceptValidBootstrapToken() throws Exception {
        String response = mockMvc.perform(post("/v1/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"superadmin@migrantcommunity.com\",\"password\":\"test-admin-password-123\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/v1/admin/administrators")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void administratorManagementRequiresSuperAdminRole() throws Exception {
        String analystToken = jwtService.issueToken("analyst@example.com", AdminRole.ANALYST);

        mockMvc.perform(get("/v1/admin/administrators")
                        .header("Authorization", "Bearer " + analystToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void logoutRevokesIssuedToken() throws Exception {
        String response = mockMvc.perform(post("/v1/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"superadmin@migrantcommunity.com\",\"password\":\"test-admin-password-123\"}"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(post("/v1/admin/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/v1/admin/administrators")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidLoginReturnsUnauthorized() throws Exception {
        mockMvc.perform(post("/v1/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"superadmin@migrantcommunity.com\",\"password\":\"incorrect-password\"}"))
                .andExpect(status().isUnauthorized());
    }
}
