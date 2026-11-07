package com.migrantcommunity.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url("/api/v1").description("Migrant Community API"))
                .info(new Info()
                        .title("Migrant Community Platform API")
                        .version("1.0.0")
                        .description("REST API for the Migrant Community Platform user and admin portals.")
                        .contact(new Contact().name("Platform Team").url("https://migrantcommunity.example.com/support"))
                        .license(new License().name("Private").url("https://migrantcommunity.example.com/license")))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement()
                        .addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT access token obtained from /api/v1/auth/login or /api/v1/admin/auth/login")));
    }
}
