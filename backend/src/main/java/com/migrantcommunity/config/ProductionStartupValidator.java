package com.migrantcommunity.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Fail closed on boot in production when required operational secrets or
 * network controls are missing.
 */
@Component
@Profile("prod")
public class ProductionStartupValidator {

    private static final Logger log = LoggerFactory.getLogger(ProductionStartupValidator.class);

    private final String jwtSecret;
    private final String dbUrl;
    private final String dbUsername;
    private final String dbPassword;
    private final String corsOrigins;
    private final boolean emailEnabled;
    private final String mailHost;

    public ProductionStartupValidator(
            @Value("${jwt.secret:}") String jwtSecret,
            @Value("${spring.datasource.url:}") String dbUrl,
            @Value("${spring.datasource.username:}") String dbUsername,
            @Value("${spring.datasource.password:}") String dbPassword,
            @Value("${app.email.enabled:true}") boolean emailEnabled,
            @Value("${spring.mail.host:}") String mailHost) {
        this.jwtSecret = jwtSecret;
        this.dbUrl = dbUrl;
        this.dbUsername = dbUsername;
        this.dbPassword = dbPassword;
        this.corsOrigins = System.getenv("CORS_ALLOWED_ORIGINS");
        this.emailEnabled = emailEnabled;
        this.mailHost = mailHost;
    }

    @PostConstruct
    void validate() {
        require("jwt.secret / JWT_SECRET", jwtSecret, 32);
        require("spring.datasource.url / DB_URL", dbUrl, 1);
        require("spring.datasource.username / DB_USERNAME", dbUsername, 1);
        require("spring.datasource.password / DB_PASSWORD", dbPassword, 1);
        require("CORS_ALLOWED_ORIGINS", corsOrigins, 1);
        if (!emailEnabled || mailHost == null || mailHost.isBlank()) {
            throw new IllegalStateException(
                    "Production requires app.email.enabled=true and spring.mail.host");
        }
        log.info("Production startup security checks passed");
    }

    private static void require(String name, String value, int minLength) {
        if (value == null || value.isBlank() || value.length() < minLength) {
            throw new IllegalStateException("Missing or invalid required production setting: " + name);
        }
    }
}
