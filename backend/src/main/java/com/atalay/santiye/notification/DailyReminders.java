package com.atalay.santiye.notification;

import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.company.CompanyStatus;
import com.atalay.santiye.post.PostStats;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.site.SiteStatus;
import com.atalay.santiye.tenant.Members;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Günlük hatırlatma (İstanbul saatiyle): 18:00 patrona "bugün haber gelmeyen şantiyeler" özeti. Şantiyenin
 * sorumlusuna 17:00 hatırlatması yoktur: herkes her şantiyededir, "o şantiyenin adamı" diye biri yok; her işçiye
 * her sessiz şantiye için bildirim gitmesin.
 */
@Component
class DailyReminders {

    private static final Logger log = LoggerFactory.getLogger(DailyReminders.class);

    private final CompanyRepository companies;
    private final SiteRepository sites;
    private final PostStats postStats;
    private final Members members;
    private final Notifier notifier;
    private final Clock clock;

    DailyReminders(CompanyRepository companies, SiteRepository sites, PostStats postStats, Members members,
        Notifier notifier, Clock clock) {
        this.companies = companies;
        this.sites = sites;
        this.postStats = postStats;
        this.members = members;
        this.notifier = notifier;
        this.clock = clock;
    }

    /** Firmalar birbirinden bağımsızdır: birinde çıkan hata (ör. bozuk bir abonelik) ötekilerin özetini durdurmaz. */
    @Scheduled(cron = "0 0 18 * * *", zone = "${app.timezone}")
    void summarizeForOwners() {
        for (Company company : companies.findAll()) {
            try {
                summarizeFor(company);
            } catch (RuntimeException failure) {
                log.warn("Günlük özet gönderilemedi: {}", company.getId(), failure);
            }
        }
    }

    private void summarizeFor(Company company) {
        if (company.getStatus() != CompanyStatus.ACTIVE) {
            return;
        }
        List<Site> silent = silentSitesOf(company);
        if (silent.isEmpty()) {
            return;
        }
        List<UUID> owners = members.activeIdsWithRole(company.getId(), UserRole.OWNER);
        String names = silent.stream().map(Site::getName).collect(Collectors.joining(", "));
        notifier.deliver(owners, new NotificationContent("Bugün haber gelmeyen şantiyeler", names, "/santiyeler"));
    }

    /** Aktif olup bugün hiç gönderi gelmeyen şantiyeler. */
    private List<Site> silentSitesOf(Company company) {
        List<Site> active = sites.findByCompanyIdOrderByName(company.getId()).stream()
            .filter(site -> site.getStatus() == SiteStatus.ACTIVE).toList();
        if (active.isEmpty()) {
            return List.of();
        }
        Instant startOfDay = LocalDate.now(clock).atStartOfDay(clock.getZone()).toInstant();
        Map<UUID, Long> postsToday = postStats.postsSince(active.stream().map(Site::getId).toList(), startOfDay);
        return active.stream().filter(site -> postsToday.getOrDefault(site.getId(), 0L) == 0).toList();
    }
}
