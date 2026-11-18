package com.migrantcommunity.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits") String token,
        @NotBlank @Size(min = 8, max = 128)
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,128}$",
                message = "Password must contain at least one uppercase, one lowercase, one digit, and one special character (@#$%^&+=!)")
        String newPassword) {
}
