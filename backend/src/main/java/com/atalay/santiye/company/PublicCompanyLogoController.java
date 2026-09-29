package com.atalay.santiye.company;

import io.swagger.v3.oas.annotations.Hidden;
import java.time.Duration;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Firma logosunu sunar (img etiketiyle kullanılır, API istemcisine girmez). Adres logonun sürümünü taşır (?v=…):
 * tarayıcı bir kez indirir; logo değişince adres de değişir.
 */
@Hidden
@RestController
class PublicCompanyLogoController {

    private final CompanyLogos logos;

    PublicCompanyLogoController(CompanyLogos logos) {
        this.logos = logos;
    }

    @GetMapping("/public/companies/{companyId}/logo")
    ResponseEntity<Resource> getCompanyLogo(@PathVariable UUID companyId) {
        return logos.read(companyId)
            .map(logo -> ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(logo.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .header("X-Content-Type-Options", "nosniff")
                .body(logo.resource()))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
