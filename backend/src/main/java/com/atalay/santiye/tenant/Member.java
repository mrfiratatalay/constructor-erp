package com.atalay.santiye.tenant;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRole;
import java.util.UUID;

/**
 * Firmanın gözüyle bir kişi: kimliği (ad, telefon) kişiden, rolü ve durumu firmadaki üyeliğinden gelir. Kimlik her
 * zaman kişinin kimliğidir (users.id); şantiyedeki gönderiler, görevler, puantaj bu kimliğe bağlıdır.
 */
public record Member(AppUser user, Membership membership) {

    public UUID getId() {
        return user.getId();
    }

    public UUID getCompanyId() {
        return membership.getCompanyId();
    }

    public String getFullName() {
        return user.getFullName();
    }

    public String getPhone() {
        return user.getPhone();
    }

    public UserRole getRole() {
        return membership.getRole();
    }

    public boolean isActive() {
        return membership.isActive();
    }
}
