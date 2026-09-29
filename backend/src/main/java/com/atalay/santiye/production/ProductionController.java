package com.atalay.santiye.production;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.production.dto.CrewRef;
import com.atalay.santiye.production.dto.ProductionBoardView;
import com.atalay.santiye.production.dto.ProductionDetailView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/** İmalatı yalnızca patron, şef ve depo sorumlusu görür; çalışan göremez (sekmesi de yoktur). */
@RequiresFeature(Features.PRODUCTION)
@RestController
@PreAuthorize("hasAuthority('VIEW_PRODUCTION')")
@Tag(name = "Production")
public class ProductionController {

    private final ProductionReads reads;

    ProductionController(ProductionReads reads) {
        this.reads = reads;
    }

    @GetMapping("/sites/{siteId}/production")
    public ProductionBoardView getProductionBoard(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID siteId) {
        return reads.board(user, siteId);
    }

    @GetMapping("/production/items/{itemId}")
    public ProductionDetailView getProductionItem(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID itemId) {
        return reads.detail(user, itemId);
    }

    @GetMapping("/production/crews")
    public List<CrewRef> listProductionCrews(@AuthenticationPrincipal CurrentUser user) {
        return reads.crews(user);
    }
}
