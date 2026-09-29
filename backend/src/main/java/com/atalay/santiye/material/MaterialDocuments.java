package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.DocumentView;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Sevkiyatın irsaliyesi: depoda kamyon yüklenirken telefonla çekilen fotoğraf ya da PDF. Yalnızca PDF, JPG ve PNG;
 * her biri en çok 10 MB. Belge eklenmesi sevkiyatın geçmişine yazılır.
 */
@Service
public class MaterialDocuments {

    private static final long MAX_BYTES = 10L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.of("application/pdf", "pdf", "image/jpeg", "jpg",
        "image/png", "png");

    private final MaterialDocumentRepository documents;
    private final Shipments shipments;
    private final MaterialFiles files;
    private final ShipmentHistory history;
    private final Clock clock;

    MaterialDocuments(MaterialDocumentRepository documents, Shipments shipments, MaterialFiles files,
        ShipmentHistory history, Clock clock) {
        this.documents = documents;
        this.shipments = shipments;
        this.files = files;
        this.history = history;
        this.clock = clock;
    }

    @Transactional
    public List<DocumentView> attach(CurrentUser user, UUID shipmentId, List<MultipartFile> uploads) {
        Shipment shipment = shipments.require(user, shipmentId);
        uploads.forEach(MaterialDocuments::requireAcceptable);
        return uploads.stream().map(upload -> store(user, shipment, upload)).toList();
    }

    /** İndirilecek belge: yalnızca kendi firmasının. */
    @Transactional(readOnly = true)
    MaterialDocument require(CurrentUser user, UUID documentId) {
        return documents.findByIdAndCompanyId(documentId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Belge bulunamadı."));
    }

    private DocumentView store(CurrentUser user, Shipment shipment, MultipartFile upload) {
        var file = new DocumentFile(fileNameOf(upload), upload.getContentType(), upload.getSize());
        MaterialDocument document = documents.save(new MaterialDocument(shipment, file, user.userId(), clock.instant()));
        try {
            files.save(document, upload);
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        history.record(shipment.getId(), ShipmentEventKind.DOCUMENT_ADDED, user, file.fileName());
        return viewOf(document.getId(), file, clock.instant());
    }

    private static DocumentView viewOf(UUID id, DocumentFile file, Instant at) {
        return new DocumentView(id, file.fileName(), file.contentType(), file.sizeBytes(),
            "/api/material-documents/" + id, at);
    }

    private static void requireAcceptable(MultipartFile upload) {
        if (!EXTENSIONS.containsKey(upload.getContentType())) {
            throw ApiException.badRequest("Yalnızca PDF, JPG ya da PNG eklenir: " + upload.getOriginalFilename());
        }
        if (upload.getSize() > MAX_BYTES) {
            throw ApiException.badRequest("Belge en çok 10 MB olabilir: " + upload.getOriginalFilename());
        }
    }

    /** Kullanıcının dosya adı yalnızca indirirken gösterilir; yol parçaları atılır, boşsa türüne göre ad verilir. */
    private static String fileNameOf(MultipartFile upload) {
        String original = upload.getOriginalFilename() == null ? "" : upload.getOriginalFilename();
        String name = original.substring(Math.max(original.lastIndexOf('/'), original.lastIndexOf('\\')) + 1).strip();
        if (name.isEmpty()) {
            name = "belge." + EXTENSIONS.get(upload.getContentType());
        }
        return name.length() > 200 ? name.substring(name.length() - 200) : name;
    }
}
