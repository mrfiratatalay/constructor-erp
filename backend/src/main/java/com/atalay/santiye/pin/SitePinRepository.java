package com.atalay.santiye.pin;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface SitePinRepository extends JpaRepository<SitePin, SitePinId> {

    @Query("select p from SitePin p where p.id.userId = :userId")
    List<SitePin> findByUser(UUID userId);
}
