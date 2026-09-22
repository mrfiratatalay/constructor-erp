package com.atalay.santiye.notification;

import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.post.PostStats;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteMembershipService;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.site.SiteStatus;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Günlük hatırlatmalar (İstanbul saatiyle):
 * 17:00 bugün gönderi gelmeyen şantiyenin sorumlusuna "durumu gönder";
 * 18:00 patrona "bugün haber gelmeyen şantiyeler" özeti.
 */
@Component
class DailyReminders {

    private final CompanyRepository companies;
    private final SiteRepository sites;
    private final SiteMembershipService memberships;
    private final PostStats postStats;
    private final UserRepository users;
    private final Notifier notifier;
    private final Clock clock;

    DailyReminders(CompanyRepository companies, SiteRepository sites, SiteMembershipService memberships,
        PostStats postStats, UserRepository users, Notifier notifier, Clock clock) {
        this.companies = companies;
        this.sites = sites;
        this.memberships = memberships;
        this.postStats = postStats;
        this.users = users;
        this.notifier = notifier;
        this.clock = clock;
    }

    @Scheduled(cron = "0 0 17 * * *", zone = "${app.timezone}")
    void remindSiteLeads() {
        for (Company company : companies.findAll()) {
            List<Site> silent = silentSitesOf(company);
            Map<UUID, List<UUID>> leads = memberships.userIdsBySite(silent.stream().map(Site::getId).toList());
            for (Site site : silent) {
                notifier.deliver(leads.getOrDefault(site.getId(), List.of()), new NotificationContent(
                    "Bugün henüz gönderi yok", site.getName() + " için bugünün durumunu gönder.",
                    "/santiyeler/" + site.getId()));
            }
        }
    }

    @Scheduled(cron = "0 0 18 * * *", zone = "${app.timezone}")
    void summarizeForOwners() {
        for (Company company : companies.findAll()) {
            List<Site> silent = silentSitesOf(company);
            if (silent.isEmpty()) {
                continue;
            }
            List<UUID> owners = users.findByCompanyIdAndRoleAndActiveTrue(company.getId(), UserRole.OWNER).stream()
                .map(AppUser::getId).toList();
            String names = silent.stream().map(Site::getName).collect(Collectors.joining(", "));
            notifier.deliver(owners, new NotificationContent("Bugün haber gelmeyen şantiyeler", names, "/santiyeler"));
        }
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
