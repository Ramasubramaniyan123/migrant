package com.migrantcommunity.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits") String token,
        @NotBlank @Size(min = 8) String newPassword) {
}
