package com.atalay.santiye.lead;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.lead.dto.SalesRequestView;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class SalesRequestQueries {

    private static final String SELECT = """
        select r.id, r.company_name, r.contact_name, r.phone, r.email, r.city, r.site_count, r.plan_id,
               p.name as plan_name, r.message, r.status, r.notes, r.company_id, c.name as converted_company_name,
               r.created_at
        from sales_requests r
        left join plans p on p.id = r.plan_id
        left join companies c on c.id = r.company_id
        """;

    private final JdbcClient jdbc;

    SalesRequestQueries(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    List<SalesRequestView> all() {
        return jdbc.sql(SELECT + "order by r.created_at desc").query(SalesRequestView.class).list();
    }

    @Transactional(readOnly = true)
    SalesRequestView one(UUID requestId) {
        return jdbc.sql(SELECT + "where r.id = :id").param("id", requestId).query(SalesRequestView.class).optional()
            .orElseThrow(() -> ApiException.notFound("Başvuru bulunamadı."));
    }
}
