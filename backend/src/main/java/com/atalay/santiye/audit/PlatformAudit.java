package com.atalay.santiye.audit;

import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import java.sql.Timestamp;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;

/**
 * Platformun kritik işlemlerinin izi: kim, ne yaptı, hangi firmada, ne zaman. İşlemle aynı işlemde (transaction)
 * yazılır: işlem geri alınırsa iz de kalmaz, iz yazılamazsa işlem de olmaz. Kayıt silinmez ve değişmez.
 */
@Component
public class PlatformAudit {

    private static final String SELECT = """
        select a.id, a.action, a.company_id, c.name as company_name, a.summary, u.full_name as actor_name, a.created_at
        from platform_audit_logs a
        left join users u on u.id = a.actor_id
        left join companies c on c.id = a.company_id
        """;

    private final JdbcClient jdbc;
    private final JsonMapper json;
    private final EntityManager entityManager;
    private final Clock clock;

    PlatformAudit(JdbcClient jdbc, JsonMapper json, EntityManager entityManager, Clock clock) {
        this.jdbc = jdbc;
        this.json = json;
        this.entityManager = entityManager;
        this.clock = clock;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void record(@Nullable UUID actorId, AuditEvent event) {
        // İz, işlemin yazdıklarından sonra yazılır: yeni açılan firma henüz veritabanına gitmediyse FK kırılırdı.
        entityManager.flush();
        jdbc.sql("""
            insert into platform_audit_logs (id, actor_id, action, company_id, summary, details, created_at)
            values (:id, :actor, :action, :company, :summary, cast(:details as jsonb), :at)""")
            .param("id", UUID.randomUUID()).param("actor", actorId).param("action", event.action().name())
            .param("company", event.companyId()).param("summary", event.summary())
            .param("details", json.writeValueAsString(event.details()))
            .param("at", Timestamp.from(clock.instant()))
            .update();
    }

    @Transactional(readOnly = true)
    public List<AuditEntryView> recent(int limit) {
        return jdbc.sql(SELECT + "order by a.created_at desc limit :limit").param("limit", limit)
            .query(AuditEntryView.class).list();
    }

    @Transactional(readOnly = true)
    public List<AuditEntryView> ofCompany(UUID companyId) {
        return jdbc.sql(SELECT + "where a.company_id = :company order by a.created_at desc limit 200")
            .param("company", companyId).query(AuditEntryView.class).list();
    }
}
