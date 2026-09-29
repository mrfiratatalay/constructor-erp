package com.atalay.santiye.puantaj;

import com.atalay.santiye.tenant.Member;
import com.atalay.santiye.user.UserRole;
import java.util.Map;
import java.util.UUID;

/**
 * Firmanın uygulamadaki kişileri, puantajın gözüyle: bağlı kalemin adı ve numarası hesabından gelir (adını
 * değiştirirse puantajda da değişir); işaretleyenin adı buradan yazılır.
 */
record RosterPeople(Map<UUID, Member> byId) {

    String nameOf(RosterEntry entry) {
        Member user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return user == null ? entry.getName() : user.getFullName();
    }

    String phoneOf(RosterEntry entry) {
        Member user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return user == null ? entry.getPhone() : user.getPhone();
    }

    String nameOfUser(UUID userId) {
        Member user = byId.get(userId);
        return user == null ? "" : user.getFullName();
    }

    /**
     * Bugünün listesinde mi? Çıkarılan kalem değil; bağlı kalemse kişi hâlâ firmada ve çalışan olmalı (şef ya da
     * patron yapılan kişi yoklamada sayılmaz, firmadan çıkarılan da).
     */
    boolean isOnList(RosterEntry entry) {
        if (entry.isArchived()) {
            return false;
        }
        Member user = entry.isLinked() ? byId.get(entry.getUserId()) : null;
        return !entry.isLinked() || (user != null && user.isActive() && user.getRole() == UserRole.WORKER);
    }
}
