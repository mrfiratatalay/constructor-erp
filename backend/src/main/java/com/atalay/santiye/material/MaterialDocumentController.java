package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import io.swagger.v3.oas.annotations.Hidden;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.core.io.Resource;
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
 * Belgeyi tarayıcıda açar (irsaliye PDF'i, fatura fotoğrafı). Arayüz bu adrese düz bir bağlantıyla gider; bu yüzden
 * API dokümanında (ve üretilen istemcide) yer almaz, medya dosyaları gibi.
 */
@Hidden
@RestController
class MaterialDocumentController {

    private final MaterialDocuments documents;
    private final MaterialFiles files;

    MaterialDocumentController(MaterialDocuments documents, MaterialFiles files) {
        this.documents = documents;
        this.files = files;
    }

    @GetMapping("/material-documents/{documentId}")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    ResponseEntity<Resource> getMaterialDocument(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID documentId) {
        MaterialDocument document = documents.require(user, documentId);
        Resource resource = files.resourceOf(document);
        if (!resource.exists()) {
            throw ApiException.notFound("Belge bulunamadı.");
        }
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline()
                .filename(document.getFileName(), StandardCharsets.UTF_8).build().toString())
            .body(resource);
    }
}
