package com.atalay.santiye.lead;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.billing.PublicPlans;
import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Başvuruların yaşamı: gelir (tanıtım sitesi), takip edilir, firmaya dönüşür (platform yönetimi). */
@Service
public class SalesRequests {

    private final SalesRequestRepository requests;
    private final PublicPlans plans;
    private final PlatformAudit audit;
    private final Clock clock;

    SalesRequests(SalesRequestRepository requests, PublicPlans plans, PlatformAudit audit, Clock clock) {
        this.requests = requests;
        this.plans = plans;
        this.audit = audit;
        this.clock = clock;
    }

    /**
     * Form herkese açıktır: seçilen paket sitede gösterilenlerden biri değilse (uydurulmuş ya da gizli bir kimlik)
     * başvuru paketsiz kaydedilir. Kimlik doğrulanmadan yazılsaydı var olmayan paket veritabanının yabancı anahtarına
     * takılıp oturumsuz istekte sunucu hatası (500) dönerdi.
     */
    @Transactional
    public SalesRequest submit(SalesRequestForm form) {
        boolean offered = form.planId() == null || plans.isOnSale(form.planId());
        return requests.save(new SalesRequest(offered ? form : form.withoutPlan(), clock.instant()));
    }

    @Transactional
    public SalesRequest follow(UUID requestId, SalesRequestStatus status, String notes, UUID actor) {
        SalesRequest request = require(requestId);
        request.follow(status, notes, clock.instant());
        audit.record(actor, AuditEvent.of(AuditAction.SALES_REQUEST_UPDATED, null,
            request.getCompanyName() + " başvurusu: " + status.name()));
        return request;
    }

    @Transactional
    public void convert(UUID requestId, UUID companyId) {
        require(requestId).convertTo(companyId, clock.instant());
    }

    @Transactional(readOnly = true)
    public long countNew() {
        return requests.countByStatus(SalesRequestStatus.NEW);
    }

    private SalesRequest require(UUID requestId) {
        return requests.findById(requestId).orElseThrow(() -> ApiException.notFound("Başvuru bulunamadı."));
    }
}
