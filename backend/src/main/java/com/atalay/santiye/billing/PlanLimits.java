package com.atalay.santiye.billing;

import com.atalay.santiye.common.error.ApiException;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Paketin sınırları: aktif kişi ve aktif şantiye sayısı. Sınır dolunca yeni kişi katılamaz, yeni şantiye açılamaz;
 * mevcut veri etkilenmez. Sınırı boş olan paket sınırsızdır.
 */
@Component
public class PlanLimits {

    private final WorkspaceAccess access;
    private final PlanRepository plans;
    private final JdbcClient jdbc;

    PlanLimits(WorkspaceAccess access, PlanRepository plans, JdbcClient jdbc) {
        this.access = access;
        this.plans = plans;
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public void requireSeat(UUID companyId) {
        Integer max = limitOf(companyId, Plan::getMaxUsers);
        if (max != null && count("select count(*) from company_memberships where company_id = :c and active", companyId) >= max) {
            throw ApiException.forbidden("Paketinizin kullanıcı sınırı (" + max + " kişi) doldu. Daha fazla kişi için "
                + "paketinizi yükseltin.", "PLAN_LIMIT");
        }
    }

    @Transactional(readOnly = true)
    public void requireSiteSlot(UUID companyId) {
        Integer max = limitOf(companyId, Plan::getMaxSites);
        if (max != null && count("select count(*) from sites where company_id = :c and status = 'ACTIVE'", companyId) >= max) {
            throw ApiException.forbidden("Paketinizin aktif şantiye sınırı (" + max + ") doldu. Biten bir şantiyeyi "
                + "tamamlandı olarak işaretleyin ya da paketinizi yükseltin.", "PLAN_LIMIT");
        }
    }

    private Integer limitOf(UUID companyId, Function<Plan, Integer> limit) {
        return access.current(companyId).flatMap(period -> plans.findById(period.getPlanId())).map(limit).orElse(null);
    }

    private long count(String sql, UUID companyId) {
        return jdbc.sql(sql).param("c", companyId).query(Long.class).single();
    }
}
