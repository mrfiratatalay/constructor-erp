package com.atalay.santiye.puantaj;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.YearMonth;
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
 * Ayın puantajı Excel olarak; tarayıcı doğrudan indirir ("puantaj-2026-09.xlsx"). Yalnızca patron: ay sonu hesabı
 * onun işidir. Oturum çerezle gider: arayüz bu adrese düz bir bağlantıyla gider, ayrıca istemci kodu gerekmez.
 */
@RequiresFeature(Features.ATTENDANCE)
@RestController
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Puantaj")
public class PuantajExportController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final PuantajExport export;

    PuantajExportController(PuantajExport export) {
        this.export = export;
    }

    @GetMapping(value = "/puantaj/export", produces = XLSX)
    public ResponseEntity<byte[]> exportPuantaj(@AuthenticationPrincipal CurrentUser user,
        @Parameter(schema = @Schema(type = "string", example = "2026-09")) @RequestParam YearMonth month) {
        String fileName = "puantaj-" + month + ".xlsx";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(XLSX))
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
            .body(export.month(user, month));
    }
}
