package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.LocationRef;
import com.atalay.santiye.material.dto.MovementRow;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Hareket satırının sorgusu ve eşlemesi; liste, detay ve Excel aynı satırı kullanır. Lokasyonun adı depoda kendisinde,
 * şantiyede şantiyenin adındadır.
 */
final class MovementRows {

    static final String COLUMNS = """
        select mv.id, mv.number, mv.day, mv.type, mv.status, mv.quantity, m.unit, m.id as material_id,
               m.name as material_name, m.code as material_code, m.category,
               mv.source_id, coalesce(sl.name, ss.name) as source_name, sl.kind as source_kind,
               mv.destination_id, coalesce(dl.name, ds.name) as destination_name, dl.kind as destination_kind,
               mv.party_id, p.name as party_name, mv.purpose, mv.usage_area, mv.description, mv.expected_return_date,
               u.full_name as created_by_name, mv.created_at,
               (select count(*) from material_documents d where d.movement_id = mv.id) as document_count
        """;
    static final String FROM = """
        from material_movements mv
        join materials m on m.id = mv.material_id
        join users u on u.id = mv.created_by
        left join stock_locations sl on sl.id = mv.source_id
        left join sites ss on ss.id = sl.site_id
        left join stock_locations dl on dl.id = mv.destination_id
        left join sites ds on ds.id = dl.site_id
        left join material_parties p on p.id = mv.party_id
        """;

    private MovementRows() {
    }

    static MovementRow map(ResultSet rs, int rowNum) throws SQLException {
        return new MovementRow(uuid(rs, "id"), rs.getLong("number"), rs.getObject("day", LocalDate.class),
            MovementType.valueOf(rs.getString("type")), MovementStatus.valueOf(rs.getString("status")),
            rs.getBigDecimal("quantity"), rs.getString("unit"), uuid(rs, "material_id"), rs.getString("material_name"),
            rs.getString("material_code"), rs.getString("category"), location(rs, "source"),
            location(rs, "destination"), uuid(rs, "party_id"), rs.getString("party_name"), purpose(rs),
            rs.getString("usage_area"), rs.getString("description"), rs.getObject("expected_return_date",
                LocalDate.class), rs.getString("created_by_name"),
            rs.getObject("created_at", OffsetDateTime.class).toInstant(), rs.getInt("document_count"));
    }

    private static LocationRef location(ResultSet rs, String end) throws SQLException {
        UUID id = uuid(rs, end + "_id");
        if (id == null) {
            return null;
        }
        return new LocationRef(id, rs.getString(end + "_name"), LocationKind.valueOf(rs.getString(end + "_kind")));
    }

    private static MovementPurpose purpose(ResultSet rs) throws SQLException {
        String purpose = rs.getString("purpose");
        return purpose == null ? null : MovementPurpose.valueOf(purpose);
    }

    private static UUID uuid(ResultSet rs, String column) throws SQLException {
        return rs.getObject(column, UUID.class);
    }
}
