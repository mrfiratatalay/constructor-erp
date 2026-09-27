package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.YearMonth;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Yoklamanın aylık Excel dosyası; tarayıcı doğrudan indirir ("yoklama-2026-09.xlsx"). Yalnızca patron. Oturum
 * çerezle gider: arayüz bu adrese düz bir bağlantıyla gider, ayrıca istemci kodu gerekmez.
 */
@RestController
@Tag(name = "Roll calls")
public class RollCallExportController {

    private static final String XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final RollCallExport export;

    RollCallExportController(RollCallExport export) {
        this.export = export;
    }

    @GetMapping(value = "/roll-calls/export", produces = XLSX)
    public ResponseEntity<byte[]> exportRollCalls(@AuthenticationPrincipal CurrentUser user,
        @Parameter(schema = @Schema(type = "string", example = "2026-09")) @RequestParam YearMonth month) {
        String fileName = "yoklama-" + month + ".xlsx";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(XLSX))
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
            .body(export.month(user, month));
    }
}
