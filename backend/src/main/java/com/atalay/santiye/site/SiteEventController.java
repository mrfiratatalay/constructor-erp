package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.dto.SiteEventView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Sites")
public class SiteEventController {

    private final SiteEvents events;

    SiteEventController(SiteEvents events) {
        this.events = events;
    }

    /** Şantiyenin sistem satırları, eskiden yeniye. Bir şantiyede birkaç düzine olur; sayfalanmaz. */
    @GetMapping("/sites/{siteId}/events")
    public List<SiteEventView> listSiteEvents(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return events.list(user, siteId);
    }
}
