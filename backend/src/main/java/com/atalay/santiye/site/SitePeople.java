package com.atalay.santiye.site;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bir şantiyenin katılımcıları: firmanın bütün aktif kişileri. Herkes her şantiyededir; şantiye başına üyelik
 * yoktur (TASARIM.md "Kişiler"). Kural burada tek yerde: katılımcı listesi, mavi tikler ve görev sorumlusu buna
 * bakar.
 */
@Component
public class SitePeople {

    private final UserRepository users;

    SitePeople(UserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<AppUser> of(UUID companyId) {
        return users.findByCompanyIdAndActiveTrueOrderByFullName(companyId);
    }
}
