package com.atalay.santiye.onboarding.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Firmanın ilk patronu: şifreyle girer. E-posta başka bir firmada kayıtlıysa şifresi doğru olmalı. */
public record SetupOwner(
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(min = 8, max = 100) String password) {
}
