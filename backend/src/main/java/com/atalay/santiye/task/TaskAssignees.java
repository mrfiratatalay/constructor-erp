package com.atalay.santiye.task;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.tenant.Member;
import com.atalay.santiye.tenant.Members;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Görevin sorumlusu firmanın erişimi açık biridir. Herkes her şantiyede olduğu için şantiyeyi görebilir; firmadan
 * çıkarılmış biri görevi hiç göremezdi.
 */
@Component
class TaskAssignees {

    private final Members members;

    TaskAssignees(Members members) {
        this.members = members;
    }

    /** Sorumlu verilmediyse görev sorumlusuz kalır; bu geçerli bir cevaptır ("sonra atarım"). */
    UUID require(Site site, UUID assigneeId) {
        if (assigneeId == null) {
            return null;
        }
        return members.find(site.getCompanyId(), assigneeId)
            .filter(Member::isActive)
            .map(Member::getId)
            .orElseThrow(() -> ApiException.badRequest("Görevin sorumlusu bulunamadı."));
    }
}
