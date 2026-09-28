package com.atalay.santiye.puantaj;

import com.atalay.santiye.user.AppUser;
import java.util.Map;
import java.util.UUID;

/**
 * Firmanın uygulamadaki kişileri, puantajın gözüyle: bağlı kalemin adı ve numarası hesabından gelir (adını
 * değiştirirse puantajda da değişir); işaretleyenin adı buradan yazılır.
 */
record RosterPeople(Map<UUID, AppUser> byId) {

    String nameOf(RosterEntry entry) {
        AppUser user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return user == null ? entry.getName() : user.getFullName();
    }

    String phoneOf(RosterEntry entry) {
        AppUser user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return user == null ? entry.getPhone() : user.getPhone();
    }

    String nameOfUser(UUID userId) {
        AppUser user = byId.get(userId);
        return user == null ? "" : user.getFullName();
    }

    /**
     * Bugünün listesinde mi? Çıkarılan kalem değil; bağlı kalemse kişi hâlâ firmada ve yoklamada sayılan biri
     * olmalı: çalışan ya da depo sorumlusu (şef ya da patron yapılan kişi sayılmaz, firmadan çıkarılan da).
     */
    boolean isOnList(RosterEntry entry) {
        if (entry.isArchived()) {
            return false;
        }
        AppUser user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return !entry.isLinked() || (user != null && user.isActive() && user.getRole().isCountedInPuantaj());
    }
}
