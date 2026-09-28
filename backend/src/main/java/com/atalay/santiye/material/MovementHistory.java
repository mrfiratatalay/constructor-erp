package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Hareketin geçmişine satır yazar (audit): kim, ne zaman, ne yaptı; varsa nedeni. */
@Component
class MovementHistory {

    private final MovementEventRepository events;
    private final Clock clock;

    MovementHistory(MovementEventRepository events, Clock clock) {
        this.events = events;
        this.clock = clock;
    }

    void record(UUID movementId, MovementEventKind kind, CurrentUser actor, String note) {
        events.save(new MovementEvent(movementId, kind, actor.userId(), note, clock.instant()));
    }
}
