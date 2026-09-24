package com.atalay.santiye.pin;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Şantiye sabitleme, WhatsApp'ta sohbet sabitlemek gibi: kişiye özel, en fazla üç. */
@Service
public class SitePins {

    private static final int MAX_PINS = 3;

    private final SitePinRepository pins;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SitePins(SitePinRepository pins, SiteAccess siteAccess, Clock clock) {
        this.pins = pins;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional
    public void pin(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        SitePinId id = new SitePinId(user.userId(), siteId);
        if (pins.existsById(id)) {
            return;
        }
        if (pins.findByUser(user.userId()).size() >= MAX_PINS) {
            throw ApiException.conflict("En fazla " + MAX_PINS + " şantiye sabitlenebilir.");
        }
        pins.save(new SitePin(id, clock.instant()));
    }

    @Transactional
    public void unpin(CurrentUser user, UUID siteId) {
        pins.deleteById(new SitePinId(user.userId(), siteId));
    }

    /** Kişinin sabitledikleri: şantiye → sabitlendiği an. */
    @Transactional(readOnly = true)
    public Map<UUID, Instant> pinnedAt(UUID userId) {
        return pins.findByUser(userId).stream()
            .collect(Collectors.toMap(pin -> pin.getId().siteId(), SitePin::getPinnedAt));
    }
}
