package com.atalay.santiye.site;

import com.atalay.santiye.site.dto.SiteLead;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRole;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * Şantiyeyi katılımcılarıyla birlikte dışarıya verilecek biçime çevirir. Herkes her şantiyede olduğu için
 * katılımcılar her şantiyede aynıdır ve bir kez sorgulanır. Birlikte istenen şantiyeler hep tek firmanındır
 * (kişi yalnızca kendi firmasını görür).
 */
@Component
class SiteViews {

    private final SitePeople people;

    SiteViews(SitePeople people) {
        this.people = people;
    }

    /** Katılımcılar rollerine göre dört gruptur: patronlar, şefler, çalışanlar, depo sorumluları (rol etiketi). */
    private record Participants(List<SiteLead> owners, List<SiteLead> leads, List<SiteLead> workers,
        List<SiteLead> storekeepers) {
    }

    List<SiteView> of(List<Site> sites) {
        if (sites.isEmpty()) {
            return List.of();
        }
        List<AppUser> everyone = people.of(sites.getFirst().getCompanyId());
        Participants participants = new Participants(withRole(everyone, UserRole.OWNER),
            withRole(everyone, UserRole.SITE_LEAD), withRole(everyone, UserRole.WORKER),
            withRole(everyone, UserRole.STOREKEEPER));
        return sites.stream().map(site -> toView(site, participants)).toList();
    }

    SiteView of(Site site) {
        return of(List.of(site)).getFirst();
    }

    private static List<SiteLead> withRole(List<AppUser> users, UserRole role) {
        return users.stream().filter(user -> user.getRole() == role).map(SiteViews::personOf).toList();
    }

    private static SiteLead personOf(AppUser user) {
        return new SiteLead(user.getId(), user.getFullName(), user.getPhone());
    }

    private static SiteView toView(Site site, Participants participants) {
        String photoUrl = site.getPhotoMediaId() == null ? null : "/api/media/" + site.getPhotoMediaId();
        return new SiteView(site.getId(), site.getName(), site.getAddress(), site.getStatus(), participants.leads(),
            participants.owners(), participants.workers(), participants.storekeepers(), photoUrl,
            photoUrl == null ? null : photoUrl + "/thumbnail");
    }
}
