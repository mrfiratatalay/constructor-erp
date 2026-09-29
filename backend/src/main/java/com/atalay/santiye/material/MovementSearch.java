package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MovementFilter;
import com.atalay.santiye.material.dto.MovementPage;
import com.atalay.santiye.material.dto.MovementPaging;
import com.atalay.santiye.material.dto.MovementRow;
import com.atalay.santiye.material.dto.MovementTypeCounts;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Hareket listesi, sunucuda süzülür ve sayfalanır: tarih, lokasyon, malzeme, firma, tür, durum, kategori ve arama
 * birlikte çalışır. Tür çiplerinin sayıları aynı süzgeçlerle (tür hariç) sayılır.
 */
@Service
public class MovementSearch {

    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private final JdbcClient jdbc;

    MovementSearch(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public MovementPage page(CurrentUser user, MovementFilter filter, MovementPaging paging) {
        int size = paging.size() == null ? DEFAULT_SIZE : Math.clamp(paging.size(), 1, MAX_SIZE);
        int page = paging.page() == null ? 0 : Math.max(paging.page(), 0);
        MovementWhere where = MovementWhere.of(user.companyId(), filter, true);
        List<MovementRow> items = jdbc.sql(MovementRows.COLUMNS + MovementRows.FROM + where.sql() + orderOf(paging)
                + " limit :limit offset :offset")
            .params(where.params()).param("limit", size).param("offset", (long) page * size)
            .query(MovementRows::map).list();
        long total = jdbc.sql("select count(*) " + MovementRows.FROM + where.sql())
            .params(where.params()).query(Long.class).single();
        return new MovementPage(items, total, page, size, counts(user, filter));
    }

    /** Excel için: süzgeçlere uyan bütün hareketler, sayfasız. */
    @Transactional(readOnly = true)
    public List<MovementRow> all(CurrentUser user, MovementFilter filter) {
        MovementWhere where = MovementWhere.of(user.companyId(), filter, true);
        return jdbc.sql(MovementRows.COLUMNS + MovementRows.FROM + where.sql() + "order by mv.day desc, mv.number desc")
            .params(where.params()).query(MovementRows::map).list();
    }

    private MovementTypeCounts counts(CurrentUser user, MovementFilter filter) {
        MovementWhere where = MovementWhere.of(user.companyId(), filter, false);
        Map<MovementType, Long> byType = jdbc.sql("select mv.type, count(*) as total " + MovementRows.FROM
                + where.sql() + "group by mv.type")
            .params(where.params())
            .query((rs, n) -> Map.entry(MovementType.valueOf(rs.getString("type")), rs.getLong("total")))
            .list().stream().collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        long all = byType.values().stream().mapToLong(Long::longValue).sum();
        return new MovementTypeCounts(all, count(byType, MovementType.INBOUND), count(byType, MovementType.TO_SITE),
            count(byType, MovementType.USED), count(byType, MovementType.TRANSFER), count(byType, MovementType.OUTBOUND),
            count(byType, MovementType.RETURN), count(byType, MovementType.ADJUSTMENT));
    }

    private static long count(Map<MovementType, Long> byType, MovementType type) {
        return byType.getOrDefault(type, 0L);
    }

    /** Sıralama yalnızca tanıdık sütunlardan; eşitlikte hareket numarası belirler (sayfa atlarken satır kaymaz). */
    private static String orderOf(MovementPaging paging) {
        String direction = paging.direction() == SortDirection.ASC ? "asc" : "desc";
        MovementSort sort = paging.sort() == null ? MovementSort.DAY : paging.sort();
        String column = switch (sort) {
            case DAY -> "mv.day";
            case QUANTITY -> "mv.quantity";
            case MATERIAL -> "lower(m.name)";
        };
        return "order by " + column + " " + direction + ", mv.number " + direction;
    }
}
