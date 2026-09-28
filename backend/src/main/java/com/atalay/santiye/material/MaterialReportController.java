package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MovementFilter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import org.springdoc.core.annotations.ParameterObject;
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
 * Malzeme raporu Excel olarak; tarayıcı doğrudan indirir. Oturum çerezle gider: arayüz bu adrese düz bir bağlantıyla
 * gider (puantaj dökümü gibi). Sayfa seçilmezse üçü de yazılır.
 */
@RestController
@Tag(name = "Materials")
public class MaterialReportController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final MaterialReport report;

    MaterialReportController(MaterialReport report) {
        this.report = report;
    }

    @GetMapping(value = "/material-reports/export", produces = XLSX)
    @PreAuthorize("hasAuthority('EXPORT_MATERIALS')")
    public ResponseEntity<byte[]> exportMaterialReport(@AuthenticationPrincipal CurrentUser user,
        @ParameterObject MovementFilter filter, @RequestParam(required = false) List<ReportSheet> sheets) {
        Set<ReportSheet> chosen = sheets == null || sheets.isEmpty() ? EnumSet.allOf(ReportSheet.class)
            : EnumSet.copyOf(sheets);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(XLSX))
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment().filename(report.fileName(filter)).build().toString())
            .body(report.workbook(user, filter, chosen));
    }
}
