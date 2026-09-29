package com.atalay.santiye.site;

import com.atalay.santiye.tenant.Member;
import com.atalay.santiye.tenant.Members;
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

    private final Members members;

    SitePeople(Members members) {
        this.members = members;
    }

    @Transactional(readOnly = true)
    public List<Member> of(UUID companyId) {
        return members.activeOf(companyId);
    }
}
