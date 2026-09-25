package com.atalay.santiye.task;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Görevin sorumlusu firmanın erişimi açık biridir. Herkes her şantiyede olduğu için şantiyeyi görebilir; firmadan
 * çıkarılmış biri görevi hiç göremezdi.
 */
@Component
class TaskAssignees {

    private final UserRepository users;

    TaskAssignees(UserRepository users) {
        this.users = users;
    }

    /** Sorumlu verilmediyse görev sorumlusuz kalır; bu geçerli bir cevaptır ("sonra atarım"). */
    UUID require(Site site, UUID assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        return users.findByIdAndCompanyId(assigneeId, site.getCompanyId())
            .filter(AppUser::isActive)
            .map(AppUser::getId)
            .orElseThrow(() -> ApiException.badRequest("Görevin sorumlusu bulunamadı."));
    }
}
