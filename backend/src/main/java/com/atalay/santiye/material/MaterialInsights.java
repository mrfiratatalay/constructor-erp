package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.Permission;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.DocumentView;
import com.atalay.santiye.material.dto.FieldMaterialRef;
import com.atalay.santiye.material.dto.MaterialDocumentLine;
import com.atalay.santiye.material.dto.MaterialOverview;
import com.atalay.santiye.material.dto.MaterialView;
import com.atalay.santiye.material.dto.ReturnRow;
import com.atalay.santiye.site.SiteAccess;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Beklenen iadeler, bir şantiyenin Saha kartlarının hareketleri ve malzeme detayı. */
@Service
public class MaterialInsights {

    private static final String RETURNS = """
        select o.id as movement_id, o.number, o.day, o.material_id, m.name as material_name, m.unit,
               p.name as party_name, coalesce(sl.name, ss.name) as source_name, o.quantity,
               coalesce(r.returned, 0) as returned, o.quantity - coalesce(r.returned, 0) as remaining,
               o.expected_return_date, o.return_note, o.status
        from material_movements o
        join materials m on m.id = o.material_id
        join stock_locations sl on sl.id = o.source_id left join sites ss on ss.id = sl.site_id
        left join material_parties p on p.id = o.party_id
        left join (select return_of_id, sum(quantity) as returned from material_movements
                   where type = 'RETURN' and status <> 'CANCELLED' group by return_of_id) r on r.return_of_id = o.id
        where o.company_id = :company and o.status in ('AWAITING_RETURN', 'PARTIALLY_RETURNED')
        """;
    private static final String FIELD_REFS = """
        select f.post_id, mv.id as movement_id, mv.number, mv.type, mv.status, m.name as material_name, mv.quantity,
               m.unit
        from material_field_posts f join material_movements mv on mv.id = f.movement_id
        join materials m on m.id = mv.material_id where f.site_id = :site
        """;
    private static final String DOCUMENTS = """
        select d.id, d.file_name, d.content_type, d.size_bytes, d.created_at, mv.id as movement_id, mv.number, mv.type,
               mv.day
        from material_documents d join material_movements mv on mv.id = d.movement_id
        where mv.material_id = :material order by mv.day desc, d.created_at desc
        """;

    private final JdbcClient jdbc;
    private final SiteAccess siteAccess;
    private final MaterialCatalog catalog;
    private final StockView stock;

    MaterialInsights(JdbcClient jdbc, SiteAccess siteAccess, MaterialCatalog catalog, StockView stock) {
        this.jdbc = jdbc;
        this.siteAccess = siteAccess;
        this.catalog = catalog;
        this.stock = stock;
    }

    /** Beklenen tarihi en yakın (ya da geçmiş) olan önde; tarihi yazılmamışlar sonda. */
    @Transactional(readOnly = true)
    public List<ReturnRow> awaitingReturns(CurrentUser user) {
        return jdbc.sql(RETURNS + "order by o.expected_return_date nulls last, o.day, o.number")
            .param("company", user.companyId()).query(ReturnRow.class).list();
    }

    /** Malzemeyi görmeyen (çalışan) boş liste alır: Saha'da gönderi düz yazı olarak görünür. */
    @Transactional(readOnly = true)
    public List<FieldMaterialRef> fieldRefs(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        if (!Permission.grantedTo(user.role()).contains(Permission.VIEW_MATERIALS)) {
            return List.of();
        }
        return jdbc.sql(FIELD_REFS).param("site", siteId).query(FieldMaterialRef.class).list();
    }

    @Transactional
    public MaterialOverview overview(CurrentUser user, UUID materialId) {
        MaterialView material = catalog.list(user).stream().filter(item -> item.id().equals(materialId)).findFirst()
            .orElseThrow(() -> ApiException.notFound("Malzeme bulunamadı."));
        List<ReturnRow> returns = jdbc.sql(RETURNS + "and o.material_id = :material order by o.day")
            .param("company", user.companyId()).param("material", materialId).query(ReturnRow.class).list();
        return new MaterialOverview(material, stock.row(user, material), returns, documents(materialId));
    }

    private List<MaterialDocumentLine> documents(UUID materialId) {
        return jdbc.sql(DOCUMENTS).param("material", materialId).query((rs, n) -> {
            DocumentView document = MaterialDocuments.viewOf(rs.getObject("id", UUID.class),
                new DocumentFile(rs.getString("file_name"), rs.getString("content_type"), rs.getLong("size_bytes")),
                rs.getObject("created_at", OffsetDateTime.class).toInstant());
            return new MaterialDocumentLine(document, rs.getObject("movement_id", UUID.class), rs.getLong("number"),
                MovementType.valueOf(rs.getString("type")), rs.getObject("day", LocalDate.class));
        }).list();
    }
}
