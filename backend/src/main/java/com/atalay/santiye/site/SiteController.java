package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.dto.CreateSiteRequest;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.site.dto.UpdateSiteRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sites")
@Tag(name = "Sites")
public class SiteController {

    private final SiteService sites;

    SiteController(SiteService sites) {
        this.sites = sites;
    }

    @GetMapping
    public List<SiteView> listSites(@AuthenticationPrincipal CurrentUser user) {
        return sites.listSites(user);
    }

    @GetMapping("/{siteId}")
    public SiteView getSite(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return sites.getSite(user, siteId);
    }

    /**
     * Şantiyeyi firmadaki herkes kurar ve düzenler (WhatsApp'ta grubun adını her katılımcı değiştirebildiği gibi):
     * sahaya ilk giden şef de kurabilsin, yazım hatasını kendisi düzeltebilsin.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SiteView createSite(@AuthenticationPrincipal CurrentUser creator,
        @Valid @RequestBody CreateSiteRequest request) {
        return sites.createSite(creator, request);
    }

    @PutMapping("/{siteId}")
    public SiteView updateSite(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @Valid @RequestBody UpdateSiteRequest request) {
        return sites.updateSite(user, siteId, request);
    }
}
