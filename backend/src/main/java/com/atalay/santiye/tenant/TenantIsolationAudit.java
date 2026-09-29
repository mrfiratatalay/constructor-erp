package com.atalay.santiye.tenant;

import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/**
 * Açılışta izolasyonu denetler. company_id kolonu olan her tablo ya RLS ile korunur ya da bilerek platform/kimlik
 * tablosu olarak aşağıda listelenir; ikisi de değilse uygulama açılmaz: yeni modülün unutulan izolasyonu üretime
 * çıkamaz (MIMARI-SAAS.md Bölüm 6).
 */
@Component
@Order(0)
class TenantIsolationAudit implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(TenantIsolationAudit.class);

    /** Platform ve kimlik tabloları: firmayı gösterirler ama firma isteği onları firma filtresiyle okumaz. */
    private static final Set<String> PLATFORM_TABLES = Set.of("companies", "company_memberships", "user_sessions",
        "invites", "subscriptions", "payments", "tenant_onboarding_invites", "platform_audit_logs", "sales_requests");

    private static final String UNPROTECTED = """
        select c.relname from pg_class c
        join pg_namespace n on n.oid = c.relnamespace and n.nspname = current_schema()
        join pg_attribute a on a.attrelid = c.oid and a.attname = 'company_id' and not a.attisdropped
        where c.relkind = 'r' and not (c.relrowsecurity and c.relforcerowsecurity)
        order by c.relname""";

    private final JdbcClient jdbc;

    TenantIsolationAudit(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<String> unprotected = jdbc.sql(UNPROTECTED).query(String.class).list().stream()
            .filter(table -> !PLATFORM_TABLES.contains(table)).toList();
        if (!unprotected.isEmpty()) {
            throw new IllegalStateException("Firma izolasyonu (RLS) olmayan tablolar: " + unprotected
                + ". Migration'a select enable_company_isolation('tablo'); ekleyin.");
        }
        configureRole();
    }

    /** Süper kullanıcı RLS'e takılmaz: firma istekleri yetkisiz role geçer; rol yoksa koruma olmaz, açılmayız. */
    private void configureRole() {
        boolean privileged = jdbc.sql(TenantScopedDataSource.PRIVILEGED).query(Boolean.class).single();
        if (!privileged) {
            return;
        }
        boolean roleExists = jdbc.sql("select exists (select 1 from pg_roles where rolname = :role)")
            .param("role", TenantScopedDataSource.TENANT_ROLE).query(Boolean.class).single();
        if (!roleExists) {
            throw new IllegalStateException("Veritabanı kullanıcısı RLS'i aşıyor ve "
                + TenantScopedDataSource.TENANT_ROLE + " rolü yok (V26).");
        }
        log.info("Veritabanı kullanıcısı ayrıcalıklı: firma istekleri {} rolüyle çalışır.",
            TenantScopedDataSource.TENANT_ROLE);
    }
}
