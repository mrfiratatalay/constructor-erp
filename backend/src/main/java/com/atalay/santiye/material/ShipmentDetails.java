package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.DocumentView;
import com.atalay.santiye.material.dto.ShipmentDetail;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sevkiyatın ayrıntısı: listedeki satırı, açıklaması, irsaliyeleri ve değişmez geçmişi bir arada. Başka firmanın
 * sevkiyatı "bulunamadı"dır.
 */
@Service
class ShipmentDetails {

    private static final String HEAD = """
        select s.description, u.full_name as created_by_name
        from material_shipments s join users u on u.id = s.created_by
        where s.id = :shipment and s.company_id = :company
        """;

    private static final String DOCUMENTS = """
        select id, file_name, content_type, size_bytes, '/api/material-documents/' || id as url, created_at
        from material_documents where shipment_id = :shipment order by created_at
        """;

    private final ShipmentRows rows;
    private final ShipmentHistory history;
    private final JdbcClient jdbc;

    ShipmentDetails(ShipmentRows rows, ShipmentHistory history, JdbcClient jdbc) {
        this.rows = rows;
        this.history = history;
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    ShipmentDetail of(CurrentUser user, UUID shipmentId) {
        Head head = jdbc.sql(HEAD)
            .param("shipment", shipmentId)
            .param("company", user.companyId())
            .query(Head.class)
            .optional()
            .orElseThrow(() -> ApiException.notFound("Sevkiyat bulunamadı."));
        List<DocumentView> documents = jdbc.sql(DOCUMENTS).param("shipment", shipmentId)
            .query(DocumentView.class).list();
        return new ShipmentDetail(rows.one(user.companyId(), shipmentId), head.description(), head.createdByName(),
            documents, history.of(shipmentId));
    }

    private record Head(String description, String createdByName) {
    }
}
