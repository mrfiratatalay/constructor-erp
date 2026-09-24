package com.atalay.santiye.pin;

import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Sites")
public class SitePinController {

    private final SitePins pins;

    SitePinController(SitePins pins) {
        this.pins = pins;
    }

    @PutMapping("/sites/{siteId}/pin")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void pinSite(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        pins.pin(user, siteId);
    }

    @DeleteMapping("/sites/{siteId}/pin")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unpinSite(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        pins.unpin(user, siteId);
    }
}
