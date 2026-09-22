package com.atalay.santiye.visit;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.visit.dto.SiteVisitView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Visits")
public class SiteVisitController {

    private final SiteVisitService visits;

    SiteVisitController(SiteVisitService visits) {
        this.visits = visits;
    }

    @PostMapping("/sites/{siteId}/visits")
    public SiteVisitView visitSite(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return visits.visit(user, siteId);
    }
}
