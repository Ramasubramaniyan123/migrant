package com.migrantcommunity.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Email configuration for development and production.
 * 
 * When spring.mail.host is not configured, provides a no-op JavaMailSender
 * so the application can start without SMTP configuration.
 */
@Configuration
public class EmailConfig {

    /**
     * Provides a no-op JavaMailSender when mail host is not configured.
     * This allows the application to start in development without SMTP.
     * EmailService will log messages instead of sending them.
     */
    @Bean
    @ConditionalOnProperty(name = "spring.mail.host", matchIfMissing = true, havingValue = "")
    public JavaMailSender javaMailSender() {
        // Return a basic JavaMailSender that won't actually send emails
        // EmailService will handle the "disabled" state via app.email.enabled
        return new JavaMailSenderImpl();
    }
}
