package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MaterialSummary;
import java.time.Clock;
import java.time.LocalDate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Özet kartlarının sayıları, tek sorguda. İptal edilen hareket hiçbir sayıya girmez. */
@Service
public class MaterialSummaries {

    private static final String SUMMARY = """
        select
          (select count(*) from materials where company_id = :company and active) as active_materials,
          count(*) filter (where type = 'TO_SITE' and day >= :month) as sent_to_sites_this_month,
          count(*) filter (where type = 'OUTBOUND' and day >= :month) as outbound_this_month,
          count(*) filter (where status in ('AWAITING_RETURN', 'PARTIALLY_RETURNED')) as awaiting_returns,
          count(*) filter (where status in ('AWAITING_RETURN', 'PARTIALLY_RETURNED')
                           and expected_return_date < :today) as overdue_returns,
          count(*) filter (where status in ('IN_TRANSIT', 'PENDING_CHECK')) as awaiting_delivery
        from material_movements where company_id = :company and status <> 'CANCELLED'
        """;

    private final JdbcClient jdbc;
    private final Clock clock;

    MaterialSummaries(JdbcClient jdbc, Clock clock) {
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public MaterialSummary of(CurrentUser user) {
        LocalDate today = LocalDate.now(clock);
        return jdbc.sql(SUMMARY)
            .param("company", user.companyId())
            .param("month", today.withDayOfMonth(1))
            .param("today", today)
            .query(MaterialSummary.class)
            .single();
    }
}
