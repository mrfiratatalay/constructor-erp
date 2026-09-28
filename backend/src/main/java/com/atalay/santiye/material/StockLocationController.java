package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.DepotRequest;
import com.atalay.santiye.material.dto.LocationView;
import com.atalay.santiye.material.dto.PartyView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Hareket formunun seçenekleri: stok lokasyonları (depolar, şantiyeler) ve şirket dışındaki taraflar. */
@RestController
@Tag(name = "Materials")
public class StockLocationController {

    private final StockLocations locations;
    private final MaterialParties parties;

    StockLocationController(StockLocations locations, MaterialParties parties) {
        this.locations = locations;
        this.parties = parties;
    }

    @GetMapping("/stock-locations")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<LocationView> listStockLocations(@AuthenticationPrincipal CurrentUser user) {
        return locations.list(user);
    }

    @PostMapping("/stock-locations")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('MANAGE_MATERIAL_CATALOG')")
    public LocationView createDepot(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody DepotRequest request) {
        return locations.createDepot(user, request);
    }

    @GetMapping("/material-parties")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<PartyView> listMaterialParties(@AuthenticationPrincipal CurrentUser user) {
        return parties.list(user);
    }
}
