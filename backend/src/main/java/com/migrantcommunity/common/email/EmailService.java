package com.migrantcommunity.common.email;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Transactional email sender backed by SMTP (spring-boot-starter-mail).
 *
 * When no SMTP host is configured the service logs the message and returns
 * {@code false} instead of pretending delivery succeeded. Callers must not
 * treat a {@code false} result as a delivered email.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final boolean enabled;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.from:${EMAIL_FROM:noreply@migrantcommunity.local}}") String fromAddress,
                        @Value("${app.email.enabled:true}") boolean enabled,
                        @Value("${spring.mail.host:}") String mailHost) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        // Auto-disable if no SMTP host is configured
        this.enabled = enabled && mailHost != null && !mailHost.isBlank();
        if (enabled && (mailHost == null || mailHost.isBlank())) {
            log.warn("Email is enabled but spring.mail.host is not configured — email sending is disabled");
        }
    }

    /**
     * Sends a plain-text email. Returns true only when SMTP accepted the
     * message; returns false (and logs) when mail is disabled or delivery fails.
     */
    public boolean send(String to, String subject, String body) {
        if (!enabled) {
            log.info("Email disabled; skipping message to={} subject={}", to, subject);
            return false;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to={} subject={}", to, subject);
            return true;
        } catch (MailException ex) {
            log.error("Failed to send email to={} subject={}: {}", to, subject, ex.getMessage());
            return false;
        }
    }

    /** Sends an HTML email. Same delivery contract as {@link #send}. */
    public boolean sendHtml(String to, String subject, String htmlBody) {
        if (!enabled) {
            log.info("Email disabled; skipping HTML message to={} subject={}", to, subject);
            return false;
        }
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            mime.setFrom(fromAddress);
            mime.setRecipients(jakarta.mail.Message.RecipientType.TO, to);
            mime.setSubject(subject, "UTF-8");
            mime.setContent(htmlBody, "text/html; charset=UTF-8");
            mailSender.send(mime);
            log.info("HTML email sent to={} subject={}", to, subject);
            return true;
        } catch (Exception ex) {
            log.error("Failed to send HTML email to={} subject={}: {}", to, subject, ex.getMessage());
            return false;
        }
    }
}
