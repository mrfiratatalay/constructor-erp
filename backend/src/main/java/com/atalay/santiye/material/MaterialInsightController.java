package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.FieldMaterialRef;
import com.atalay.santiye.material.dto.MaterialOverview;
import com.atalay.santiye.material.dto.ReturnRow;
import com.atalay.santiye.material.dto.StockRow;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Stok görünümü, beklenen iadeler, malzeme detayı ve Saha kartlarının bağlı olduğu hareketler. */
@RestController
@Tag(name = "Materials")
public class MaterialInsightController {

    private final StockView stock;
    private final MaterialInsights insights;

    MaterialInsightController(StockView stock, MaterialInsights insights) {
        this.stock = stock;
        this.insights = insights;
    }

    @GetMapping("/material-stock")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<StockRow> listMaterialStock(@AuthenticationPrincipal CurrentUser user) {
        return stock.rows(user);
    }

    @GetMapping("/materials/{materialId}/overview")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public MaterialOverview getMaterialOverview(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID materialId) {
        return insights.overview(user, materialId);
    }

    @GetMapping("/material-movements/awaiting-returns")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<ReturnRow> listAwaitingReturns(@AuthenticationPrincipal CurrentUser user) {
        return insights.awaitingReturns(user);
    }

    /** Saha kartları: şantiyeyi gören herkes sorar; malzemeyi görmeyen boş liste alır. */
    @GetMapping("/material-movements/field-refs")
    public List<FieldMaterialRef> listFieldMaterialRefs(@AuthenticationPrincipal CurrentUser user,
        @RequestParam UUID siteId) {
        return insights.fieldRefs(user, siteId);
    }
}
