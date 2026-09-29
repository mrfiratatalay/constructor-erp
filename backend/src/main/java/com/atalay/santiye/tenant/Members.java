package com.atalay.santiye.tenant;

import com.atalay.santiye.user.UserRole;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firmanın kişi rehberi. Firma filtresi her sorguda: başka firmanın kişisi hiçbir yoldan dönmez. Firmalar küçüktür
 * (birkaç on kişi), süzmeler bellekte yapılır.
 */
@Component
public class Members {

    private final MembershipRepository memberships;

    Members(MembershipRepository memberships) {
        this.memberships = memberships;
    }

    @Transactional(readOnly = true)
    public List<Member> of(UUID companyId) {
        return memberships.findMembers(companyId);
    }

    @Transactional(readOnly = true)
    public List<Member> activeOf(UUID companyId) {
        return of(companyId).stream().filter(Member::isActive).toList();
    }

    @Transactional(readOnly = true)
    public List<UUID> activeIdsWithRole(UUID companyId, UserRole role) {
        return activeOf(companyId).stream().filter(member -> member.getRole() == role).map(Member::getId).toList();
    }

    @Transactional(readOnly = true)
    public Optional<Member> find(UUID companyId, UUID userId) {
        return memberships.findMember(companyId, userId);
    }
}
