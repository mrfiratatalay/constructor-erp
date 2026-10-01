package com.atalay.santiye.tenant;

import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kişinin hangi firmada çalıştığı. Oturumun seçtiği firmada aktif üyelik varsa o; yoksa (firmadan çıkarıldı ya da hiç
 * seçilmedi) kişinin en eski aktif üyeliği. Karar her istekte sunucuda, üyelik tablosuna bakılarak verilir.
 */
@Component
public class Workspaces {

    private final MembershipRepository memberships;

    Workspaces(MembershipRepository memberships) {
        this.memberships = memberships;
    }

    @Transactional(readOnly = true)
    public Optional<Membership> resolve(UUID userId, @Nullable UUID preferredCompanyId) {
        Optional<Membership> preferred = preferredCompanyId == null ? Optional.empty() : active(preferredCompanyId, userId);
        return preferred.or(() -> activeOf(userId).stream().findFirst());
    }

    @Transactional(readOnly = true)
    public Optional<Membership> active(UUID companyId, UUID userId) {
        return memberships.findByCompanyIdAndUserId(companyId, userId).filter(Membership::isActive);
    }

    @Transactional(readOnly = true)
    public List<Membership> activeOf(UUID userId) {
        return memberships.findByUserIdAndActiveTrueOrderByCreatedAt(userId);
    }

    /**
     * Kimliğin tamamı bu firmada mı: şifresi ve platform rolü yok, başka hiçbir firmada üyeliği yok. Firmanın patronu
     * kimliği yalnızca o zaman başkasına devredebilir (giriş linki, bağlantıyla geri dönüş). Şifreyle giren biri başka
     * bir firmanın patronu ya da platform yöneticisi olabilir: onun yerine oturum açılırsa o firmalara da geçilirdi.
     */
    @Transactional(readOnly = true)
    public boolean isConfinedTo(AppUser user, UUID companyId) {
        return user.isLinkOnly() && !memberships.existsByUserIdAndCompanyIdNot(user.getId(), companyId);
    }
}
