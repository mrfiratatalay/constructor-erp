package com.atalay.santiye.audit;

import jakarta.annotation.Nullable;
import java.util.Map;
import java.util.UUID;

/** Yazılacak iz: ne oldu, hangi firmada, tek cümlelik özet ve ayrıntı (eski/yeni değerler). */
public record AuditEvent(AuditAction action, @Nullable UUID companyId, String summary, Map<String, ?> details) {

    public static AuditEvent of(AuditAction action, @Nullable UUID companyId, String summary) {
        return new AuditEvent(action, companyId, summary, Map.of());
    }

    public AuditEvent with(Map<String, ?> more) {
        return new AuditEvent(action, companyId, summary, more);
    }
}
