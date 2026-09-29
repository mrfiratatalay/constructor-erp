package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.DocumentView;
import com.atalay.santiye.material.dto.FieldPostRef;
import com.atalay.santiye.material.dto.HistoryEntry;
import com.atalay.santiye.material.dto.MovementDetail;
import com.atalay.santiye.material.dto.MovementLink;
import com.atalay.santiye.material.dto.MovementRow;
import com.atalay.santiye.material.dto.ReturnLine;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Hareketin ayrıntısı: satırın kendisi, stoğa dokunmayan notları, ödünçte iadeleri ve kalanı, belgeleri, Saha
 * referansları ve değişmez geçmişi (kim ne zaman oluşturdu, teslim aldı, düzeltti, iptal etti).
 */
@Component
class MovementDetails {

    private static final String EXTRAS = """
        select mv.return_note, mv.reason, mv.system_quantity, mv.counted_quantity, mv.return_of_id, o.number as of_number
        from material_movements mv left join material_movements o on o.id = mv.return_of_id where mv.id = :id
        """;
    private static final String RETURNS = """
        select r.id, r.number, r.day, r.quantity, r.status, coalesce(l.name, s.name) as destination_name
        from material_movements r join stock_locations l on l.id = r.destination_id left join sites s on s.id = l.site_id
        where r.return_of_id = :id order by r.day, r.number
        """;
    private static final String DOCUMENTS = """
        select id, file_name, content_type, size_bytes, created_at from material_documents
        where movement_id = :id order by created_at
        """;
    private static final String FIELD_POSTS = """
        select f.post_id, f.site_id, s.name as site_name from material_field_posts f join sites s on s.id = f.site_id
        where f.movement_id = :id
        """;
    private static final String HISTORY = """
        select e.kind, u.full_name as actor_name, e.note, e.created_at as at from material_movement_events e
        join users u on u.id = e.actor_id where e.movement_id = :id order by e.created_at, e.kind
        """;

    private final JdbcClient jdbc;

    MovementDetails(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public MovementDetail of(CurrentUser user, UUID movementId) {
        MovementRow row = jdbc.sql(MovementRows.COLUMNS + MovementRows.FROM
                + "where mv.id = :id and mv.company_id = :company")
            .param("id", movementId).param("company", user.companyId())
            .query(MovementRows::map).optional()
            .orElseThrow(() -> ApiException.notFound("Hareket bulunamadı."));
        List<ReturnLine> returns = jdbc.sql(RETURNS).param("id", movementId).query(ReturnLine.class).list();
        return jdbc.sql(EXTRAS).param("id", movementId).query((rs, n) -> {
            UUID returnOf = rs.getObject("return_of_id", UUID.class);
            BigDecimal returned = returnedOf(row, returns);
            return new MovementDetail(row, rs.getString("return_note"), rs.getString("reason"),
                rs.getBigDecimal("system_quantity"), rs.getBigDecimal("counted_quantity"),
                returnOf == null ? null : new MovementLink(returnOf, rs.getLong("of_number")), returns, returned,
                returned == null ? null : row.quantity().subtract(returned), documents(movementId),
                jdbc.sql(FIELD_POSTS).param("id", movementId).query(FieldPostRef.class).list(), history(movementId));
        }).single();
    }

    /** Yalnızca ödünç çıkışında: iptal edilmemiş iadelerin toplamı. */
    private static BigDecimal returnedOf(MovementRow row, List<ReturnLine> returns) {
        if (row.purpose() != MovementPurpose.LOANED) {
            return null;
        }
        return returns.stream().filter(line -> line.status() != MovementStatus.CANCELLED)
            .map(ReturnLine::quantity).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<DocumentView> documents(UUID movementId) {
        return jdbc.sql(DOCUMENTS).param("id", movementId).query((rs, n) -> MaterialDocuments.viewOf(
            rs.getObject("id", UUID.class), new DocumentFile(rs.getString("file_name"), rs.getString("content_type"),
                rs.getLong("size_bytes")), rs.getObject("created_at", OffsetDateTime.class).toInstant())).list();
    }

    private List<HistoryEntry> history(UUID movementId) {
        return jdbc.sql(HISTORY).param("id", movementId).query((rs, n) -> new HistoryEntry(
            MovementEventKind.valueOf(rs.getString("kind")), rs.getString("actor_name"), rs.getString("note"),
            rs.getObject("at", OffsetDateTime.class).toInstant())).list();
    }
}
