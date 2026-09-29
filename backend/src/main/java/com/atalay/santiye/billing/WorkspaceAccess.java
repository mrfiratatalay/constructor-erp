package com.atalay.santiye.billing;

import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.company.CompanyStatus;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Abonelik bekçisi: firmanın çalışma alanı açık mı, hangi modüller açık? Her istekte sorulur; firma başına kısa süre
 * önbellekte tutulur (anahtar firma kimliğidir, bir firmanın durumu diğerine düşmez). Platform yönetimi firmanın
 * durumunu ya da aboneliğini değiştirince o firmanın kaydı hemen silinir.
 */
@Service
public class WorkspaceAccess {

    private static final Duration TTL = Duration.ofSeconds(30);

    private record Cached(WorkspaceStatus status, Instant until) {
    }

    private final Map<UUID, Cached> cache = new ConcurrentHashMap<>();
    private final CompanyRepository companies;
    private final SubscriptionRepository subscriptions;
    private final PlanRepository plans;
    private final PlanCatalog catalog;
    private final Clock clock;

    WorkspaceAccess(CompanyRepository companies, SubscriptionRepository subscriptions, PlanRepository plans,
        PlanCatalog catalog, Clock clock) {
        this.companies = companies;
        this.subscriptions = subscriptions;
        this.plans = plans;
        this.catalog = catalog;
        this.clock = clock;
    }

    public WorkspaceStatus statusOf(UUID companyId) {
        Instant now = clock.instant();
        Cached cached = cache.get(companyId);
        if (cached != null && now.isBefore(cached.until())) {
            return cached.status();
        }
        WorkspaceStatus status = compute(companyId);
        cache.put(companyId, new Cached(status, now.plus(TTL)));
        return status;
    }

    public void evict(UUID companyId) {
        cache.remove(companyId);
    }

    /** Paketin modülleri değişince o paketteki bütün firmalar etkilenir. */
    public void evictAll() {
        cache.clear();
    }

    /** Bugünü kapsayan dönem; yoksa en son biten (ya da başlayacak) dönem (bkz. Periods). */
    public Optional<Subscription> current(UUID companyId) {
        return Periods.current(subscriptions.findByCompanyIdOrderByStartsOnDesc(companyId), LocalDate.now(clock));
    }

    private WorkspaceStatus compute(UUID companyId) {
        Company company = companies.findById(companyId).orElse(null);
        Optional<Subscription> period = current(companyId);
        String planName = period.flatMap(found -> plans.findById(found.getPlanId())).map(Plan::getName).orElse(null);
        SubscriptionState state = period.map(found -> found.stateOn(LocalDate.now(clock))).orElse(null);
        LockReason reason = lockReasonOf(company, state);
        Set<String> features = reason == null ? catalog.enabledFeatures(period.get().getPlanId()) : Set.of();
        return new WorkspaceStatus(companyId, reason == null, reason, features, planName,
            period.map(Subscription::getEndsOn).orElse(null), state);
    }

    private static LockReason lockReasonOf(Company company, SubscriptionState state) {
        if (company == null || company.getStatus() == CompanyStatus.ARCHIVED) {
            return LockReason.COMPANY_ARCHIVED;
        }
        if (company.getStatus() == CompanyStatus.SUSPENDED) {
            return LockReason.COMPANY_SUSPENDED;
        }
        if (state == null) {
            return LockReason.NO_SUBSCRIPTION;
        }
        return switch (state) {
            case ACTIVE -> null;
            case SCHEDULED -> LockReason.SUBSCRIPTION_NOT_STARTED;
            case EXPIRED -> LockReason.SUBSCRIPTION_EXPIRED;
            case SUSPENDED -> LockReason.SUBSCRIPTION_SUSPENDED;
            case CANCELLED -> LockReason.SUBSCRIPTION_CANCELLED;
        };
    }
}
