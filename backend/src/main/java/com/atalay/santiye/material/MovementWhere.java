package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.MovementFilter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Hareket listesinin "where" parçası, süzgeçlerden: boş süzgeç yazılmaz, değerler hep parametredir (SQL'e yazı
 * eklenmez). Tür çiplerinin sayıları tür süzgeci olmadan sayılır.
 */
final class MovementWhere {

    private static final String SEARCH = """
        (m.name ilike :q or m.code ilike :q or p.name ilike :q or coalesce(sl.name, ss.name) ilike :q
         or coalesce(dl.name, ds.name) ilike :q or mv.description ilike :q or mv.usage_area ilike :q
         or cast(mv.number as varchar) = :number)""";

    private final List<String> clauses = new ArrayList<>();
    private final Map<String, Object> params = new HashMap<>();

    private MovementWhere(UUID companyId) {
        add("mv.company_id = :company", "company", companyId);
    }

    static MovementWhere of(UUID companyId, MovementFilter filter, boolean withType) {
        MovementWhere where = new MovementWhere(companyId);
        where.add("mv.day >= :from", "from", filter.from());
        where.add("mv.day <= :to", "to", filter.to());
        where.add("(mv.source_id = :location or mv.destination_id = :location)", "location", filter.locationId());
        where.add("mv.material_id = :material", "material", filter.materialId());
        where.add("mv.party_id = :party", "party", filter.partyId());
        where.add("mv.status = :status", "status", filter.status() == null ? null : filter.status().name());
        where.add("m.category = :category", "category", MaterialTexts.tidy(filter.category()));
        if (withType) {
            where.add("mv.type = :type", "type", filter.type() == null ? null : filter.type().name());
        }
        where.search(MaterialTexts.tidy(filter.q()));
        return where;
    }

    String sql() {
        return "where " + String.join(" and ", clauses) + " ";
    }

    Map<String, Object> params() {
        return params;
    }

    private void add(String clause, String name, Object value) {
        if (value != null) {
            clauses.add(clause);
            params.put(name, value);
        }
    }

    /** "MH-000123", "000123" ve "123" aynı harekettir; yazı her alanda parça olarak aranır. */
    private void search(String text) {
        if (text == null) {
            return;
        }
        clauses.add(SEARCH);
        params.put("q", "%" + text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%");
        String digits = text.toUpperCase(Locale.ROOT).replaceFirst("^MH-?", "").replaceFirst("^0+", "");
        params.put("number", digits.matches("\\d{1,18}") ? digits : "");
    }
}
