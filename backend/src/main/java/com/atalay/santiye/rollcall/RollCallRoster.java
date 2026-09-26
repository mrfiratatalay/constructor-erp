package com.atalay.santiye.rollcall;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.text.Collator;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Bir günün yoklamasında kimler var: firmanın patron olmayan aktif kişileri, o gün firmada olanlar (bugün katılan
 * biri eski günlerde "katılmadı" görünmesin). Sonradan çıkarılan ya da patron yapılan kişinin o güne ait kaydı
 * varsa o da listededir: geçmiş silinmez.
 */
@Component
class RollCallRoster {

    private static final Comparator<AppUser> BY_NAME =
        Comparator.comparing(AppUser::getFullName, Collator.getInstance(Locale.forLanguageTag("tr")));

    private final UserRepository users;
    private final Clock clock;

    RollCallRoster(UserRepository users, Clock clock) {
        this.users = users;
        this.clock = clock;
    }

    List<AppUser> on(UUID companyId, LocalDate day, Collection<UUID> recorded) {
        Map<UUID, AppUser> roster = new LinkedHashMap<>();
        users.findByCompanyIdAndRoleAndActiveTrue(companyId, UserRole.SITE_LEAD).stream()
            .filter(user -> !joinedOn(user).isAfter(day))
            .forEach(user -> roster.put(user.getId(), user));
        users.findAllById(recorded).forEach(user -> roster.putIfAbsent(user.getId(), user));
        return roster.values().stream().sorted(BY_NAME).toList();
    }

    LocalDate joinedOn(AppUser user) {
        return LocalDate.ofInstant(user.getCreatedAt(), clock.getZone());
    }
}
