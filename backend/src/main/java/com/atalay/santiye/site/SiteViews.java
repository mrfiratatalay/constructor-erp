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

    /** Katılımcılar iki gruba ayrılır: patronlar ve şefler (ekranda rol etiketi). */
    private record Participants(List<SiteLead> owners, List<SiteLead> leads) {
    }

    List<SiteView> of(List<Site> sites) {
        if (sites.isEmpty()) {
            return List.of();
        }
        List<AppUser> everyone = people.of(sites.getFirst().getCompanyId());
        Participants participants = new Participants(
            withRole(everyone, true).stream().map(SiteViews::personOf).toList(),
            withRole(everyone, false).stream().map(SiteViews::personOf).toList());
        return sites.stream().map(site -> toView(site, participants)).toList();
    }

    SiteView of(Site site) {
        return of(List.of(site)).getFirst();
    }

    private static List<AppUser> withRole(List<AppUser> users, boolean owners) {
        return users.stream().filter(user -> (user.getRole() == UserRole.OWNER) == owners).toList();
    }

    private static SiteLead personOf(AppUser user) {
        return new SiteLead(user.getId(), user.getFullName(), user.getPhone());
    }

    private static SiteView toView(Site site, Participants participants) {
        String photoUrl = site.getPhotoMediaId() == null ? null : "/api/media/" + site.getPhotoMediaId();
        return new SiteView(site.getId(), site.getName(), site.getAddress(), site.getStatus(), participants.leads(),
            participants.owners(), photoUrl, photoUrl == null ? null : photoUrl + "/thumbnail");
    }
}
