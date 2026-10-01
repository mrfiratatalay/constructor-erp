package com.atalay.santiye.pin;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface SitePinRepository extends JpaRepository<SitePin, SitePinId> {

    @Query("select p from SitePin p where p.id.userId = :userId")
    List<SitePin> findByUser(UUID userId);

    /**
     * Sabitleme tek komutta: önce "var mı" bakıp sonra eklemek, aynı anda gelen iki dokunuşta ikisini de eklemeye
     * götürüyor, ikincisi birincil anahtara takılıp 500 dönüyordu. Zaten sabitliyse hiçbir şey olmaz.
     */
    @Modifying
    @Query(value = "insert into site_pins (user_id, site_id, pinned_at) values (:userId, :siteId, :pinnedAt) "
        + "on conflict (user_id, site_id) do nothing", nativeQuery = true)
    int insertIfAbsent(UUID userId, UUID siteId, Instant pinnedAt);
}
