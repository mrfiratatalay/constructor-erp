package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.CreateWorkerRequest;
import com.atalay.santiye.attendance.dto.WorkerView;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.team.PersonNames;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyenin personel listesi. Şantiyeyi gören herkes (firmadaki herkes; bkz. SiteAccess) listeyi görür ve
 * yoklama penceresinden kişi ekler; ayrı bir personel yönetim ekranı yoktur.
 */
@Service
public class SiteWorkers {

    private final SiteWorkerRepository workers;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SiteWorkers(SiteWorkerRepository workers, SiteAccess siteAccess, Clock clock) {
        this.workers = workers;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<WorkerView> listWorkers(CurrentUser user, UUID siteId) {
        Site site = siteAccess.requireVisible(user, siteId);
        return workers.findBySiteIdOrderByFullName(site.getId()).stream().map(SiteWorkers::toView).toList();
    }

    /** Ad Türkçe kurallarıyla yazılır ("ALİ USTA" → "Ali Usta"); boş bırakılan görev yok sayılır. */
    @Transactional
    public WorkerView addWorker(CurrentUser user, UUID siteId, CreateWorkerRequest request) {
        Site site = siteAccess.requireVisible(user, siteId);
        String trade = request.trade() == null || request.trade().isBlank() ? null : request.trade().trim();
        WorkerName name = new WorkerName(PersonNames.tidy(request.fullName()), trade);
        return toView(workers.save(new SiteWorker(site, name, user.userId(), clock.instant())));
    }

    static WorkerView toView(SiteWorker worker) {
        return new WorkerView(worker.getId(), worker.getFullName(), worker.getTrade());
    }
}
