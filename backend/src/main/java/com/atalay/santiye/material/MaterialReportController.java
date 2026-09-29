package com.atalay.santiye.material;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.annotation.Nullable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Sevkiyat dökümü Excel olarak; tarayıcı doğrudan indirir. Oturum çerezle gider: arayüz bu adrese düz bir bağlantıyla
 * gider (puantaj dökümü gibi), bu yüzden üretilen istemcide yer almaz.
 */
@Hidden
@RequiresFeature(Features.MATERIALS)
@RestController
class MaterialReportController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final MaterialReport report;

    MaterialReportController(MaterialReport report) {
        this.report = report;
    }

    @GetMapping(value = "/shipment-reports/export", produces = XLSX)
    @PreAuthorize("hasAuthority('EXPORT_MATERIALS')")
    ResponseEntity<byte[]> exportShipmentReport(@AuthenticationPrincipal CurrentUser user,
        @RequestParam(required = false) @Nullable String search) {
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(XLSX))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment().filename(report.fileName()).build().toString())
            .body(report.workbook(user, search));
    }
}
