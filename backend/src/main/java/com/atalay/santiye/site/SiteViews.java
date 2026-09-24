package com.atalay.santiye.site;

import com.atalay.santiye.site.dto.SiteLead;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Şantiyeyi katılımcılarının adlarıyla birlikte dışarıya verilecek biçime çevirir; tek sorguda toplu yapar. */
@Component
class SiteViews {

    private final SiteMembershipService memberships;
    private final UserRepository users;

    SiteViews(SiteMembershipService memberships, UserRepository users) {
        this.memberships = memberships;
        this.users = users;
    }

    List<SiteView> of(List<Site> sites) {
        Map<UUID, List<UUID>> leadIds = memberships.userIdsBySite(sites.stream().map(Site::getId).toList());
        Map<UUID, AppUser> leads = activeUsers(leadIds.values().stream().flatMap(List::stream).toList());
        return sites.stream().map(site -> toView(site, leadIds.getOrDefault(site.getId(), List.of()), leads)).toList();
    }

    SiteView of(Site site) {
        return of(List.of(site)).getFirst();
    }

    private Map<UUID, AppUser> activeUsers(Collection<UUID> ids) {
        return users.findAllById(ids).stream()
            .filter(AppUser::isActive)
            .collect(Collectors.toMap(AppUser::getId, Function.identity()));
    }

    private static SiteView toView(Site site, List<UUID> leadIds, Map<UUID, AppUser> leads) {
        List<SiteLead> siteLeads = leadIds.stream()
            .map(leads::get)
            .filter(user -> user != null)
            .map(user -> new SiteLead(user.getId(), user.getFullName(), user.getPhone()))
            .toList();
        UUID photo = site.getPhotoMediaId();
        String photoUrl = photo == null ? null : "/api/media/" + photo;
        return new SiteView(site.getId(), site.getName(), site.getAddress(), site.getStatus(), siteLeads, photoUrl,
            photoUrl == null ? null : photoUrl + "/thumbnail");
    }
}
