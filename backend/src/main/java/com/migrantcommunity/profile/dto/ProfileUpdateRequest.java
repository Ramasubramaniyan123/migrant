package com.migrantcommunity.profile.dto;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ProfileUpdateRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Past LocalDate dateOfBirth,
        @Size(max = 50) String gender,
        @Size(max = 2000) String bio,
        @Size(max = 100) String hometownCountry,
        @Size(max = 100) String hometownCity) {
}
