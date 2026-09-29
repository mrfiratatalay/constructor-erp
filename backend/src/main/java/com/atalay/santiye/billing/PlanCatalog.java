package com.atalay.santiye.billing;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Modüller ve paketlerin açtığı modüller (features, plan_features). */
@Component
public class PlanCatalog {

    private final JdbcClient jdbc;

    PlanCatalog(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public List<FeatureInfo> features() {
        return jdbc.sql("select key, name, description from features order by sort_order").query(FeatureInfo.class).list();
    }

    @Transactional(readOnly = true)
    public Set<String> enabledFeatures(UUID planId) {
        return Set.copyOf(jdbc.sql("select feature_key from plan_features where plan_id = :plan and enabled")
            .param("plan", planId).query(String.class).list());
    }

    @Transactional(readOnly = true)
    public Map<UUID, Set<String>> enabledByPlan() {
        record Row(UUID planId, String featureKey) {
        }
        return jdbc.sql("select plan_id, feature_key from plan_features where enabled").query(Row.class).list().stream()
            .collect(Collectors.groupingBy(Row::planId, Collectors.mapping(Row::featureKey, Collectors.toSet())));
    }

    /** Paketin açtığı modülleri verilen kümeye eşitler; bilinmeyen anahtar yok sayılır. */
    @Transactional
    public void setFeatures(UUID planId, Collection<String> enabled) {
        jdbc.sql("""
            insert into plan_features (plan_id, feature_key, enabled)
            select :plan, f.key, f.key in (:keys) from features f
            on conflict (plan_id, feature_key) do update set enabled = excluded.enabled""")
            .param("plan", planId)
            .param("keys", enabled.isEmpty() ? List.of("") : List.copyOf(enabled))
            .update();
    }
}
