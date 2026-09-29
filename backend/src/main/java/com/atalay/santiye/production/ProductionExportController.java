package com.atalay.santiye.production;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Şantiyenin imalat raporu Excel olarak; tarayıcı doğrudan indirir ("imalat-2026-09-28.xlsx"). İmalatı gören herkes
 * alır (patron, şef, depo sorumlusu). Oturum çerezle gider: arayüz bu adrese düz bir bağlantıyla gider.
 */
@RequiresFeature(Features.PRODUCTION)
@RestController
@PreAuthorize("hasAuthority('VIEW_PRODUCTION')")
@Tag(name = "Production")
public class ProductionExportController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final ProductionExport export;
    private final Clock clock;

    ProductionExportController(ProductionExport export, Clock clock) {
        this.export = export;
        this.clock = clock;
    }

    @GetMapping(value = "/sites/{siteId}/production/export", produces = XLSX)
    public ResponseEntity<byte[]> exportProduction(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID siteId) {
        String fileName = "ilerleme-" + LocalDate.now(clock) + ".xlsx";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(XLSX))
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
            .body(export.site(user, siteId));
    }
}
