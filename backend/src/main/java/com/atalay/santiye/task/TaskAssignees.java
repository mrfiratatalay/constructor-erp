package com.atalay.santiye.task;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteMembershipService;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Görevin sorumlusu şantiyeyi görebilen, erişimi açık biridir: patron ya da o şantiyenin sorumlusu.
 * Görmediği şantiyenin görevini üstlenen kişi görevi hiç göremezdi.
 */
@Component
class TaskAssignees {

    private final UserRepository users;
    private final SiteMembershipService memberships;

    TaskAssignees(UserRepository users, SiteMembershipService memberships) {
        this.users = users;
        this.memberships = memberships;
    }

    /** Sorumlu verilmediyse görev sorumlusuz kalır; bu geçerli bir cevaptır ("sonra atarım"). */
    UUID require(Site site, UUID assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        AppUser assignee = users.findByIdAndCompanyId(assigneeId, site.getCompanyId())
            .filter(AppUser::isActive)
            .orElseThrow(() -> ApiException.badRequest("Görevin sorumlusu bulunamadı."));
        if (assignee.getRole() != UserRole.OWNER && !isMember(site, assigneeId)) {
            throw ApiException.badRequest("Görevin sorumlusu bu şantiyede değil.");
        }
        return assigneeId;
    }

    private boolean isMember(Site site, UUID userId) {
        return memberships.userIdsBySite(List.of(site.getId()))
            .getOrDefault(site.getId(), List.of())
            .contains(userId);
    }
}
