package com.atalay.santiye.material;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MaterialRequest;
import com.atalay.santiye.material.dto.MaterialView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Malzeme kartları: listelemek herkese (malzemeyi gören), eklemek ve düzeltmek katalog yetkisine. */
@RequiresFeature(Features.MATERIALS)
@RestController
@RequestMapping("/materials")
@Tag(name = "Materials")
public class MaterialController {

    private final MaterialCatalog catalog;

    MaterialController(MaterialCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<MaterialView> listMaterials(@AuthenticationPrincipal CurrentUser user) {
        return catalog.list(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('MANAGE_MATERIAL_CATALOG')")
    public MaterialView createMaterial(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody MaterialRequest request) {
        return catalog.create(user, request);
    }

    @PutMapping("/{materialId}")
    @PreAuthorize("hasAuthority('MANAGE_MATERIAL_CATALOG')")
    public MaterialView updateMaterial(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID materialId,
        @Valid @RequestBody MaterialRequest request) {
        return catalog.update(user, materialId, request);
    }
}
