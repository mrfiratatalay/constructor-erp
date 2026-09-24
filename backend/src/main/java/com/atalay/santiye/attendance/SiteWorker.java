package com.atalay.santiye.attendance;

import com.atalay.santiye.site.Site;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Şantiyenin personeli (işçi, usta). Uygulama kullanıcısı değildir: yalnızca yoklamada adı geçer. */
@Entity
@Table(name = "site_workers")
public class SiteWorker {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID siteId;
    private String fullName;
    private String trade;
    private UUID createdBy;
    private Instant createdAt;

    protected SiteWorker() {
    }

    SiteWorker(Site site, WorkerName name, UUID createdBy, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = site.getCompanyId();
        this.siteId = site.getId();
        this.fullName = name.fullName();
        this.trade = name.trade();
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSiteId() {
        return siteId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getTrade() {
        return trade;
    }
}
