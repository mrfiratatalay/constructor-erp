package com.atalay.santiye.production;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.production.dto.ProductionEntryForm;
import com.atalay.santiye.production.dto.ProductionEntryView;
import com.atalay.santiye.production.dto.ProductionItemRequest;
import com.atalay.santiye.production.dto.ProductionItemView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** İmalata veriyi yalnızca şantiye şefi girer: imalat açar, düzeltir, siler ve günlük girişleri yapar. */
@RestController
@PreAuthorize("hasRole('SITE_LEAD')")
@Tag(name = "Production")
public class ProductionEditController {

    private final ProductionItems items;
    private final ProductionEntries entries;

    ProductionEditController(ProductionItems items, ProductionEntries entries) {
        this.items = items;
        this.entries = entries;
    }

    @PostMapping("/sites/{siteId}/production/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductionItemView createProductionItem(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID siteId, @Valid @RequestBody ProductionItemRequest request) {
        return items.create(user, siteId, request);
    }

    @PatchMapping("/production/items/{itemId}")
    public ProductionItemView updateProductionItem(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID itemId, @Valid @RequestBody ProductionItemRequest request) {
        return items.update(user, itemId, request);
    }

    @DeleteMapping("/production/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductionItem(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID itemId) {
        items.delete(user, itemId);
    }

    @PostMapping(value = "/production/items/{itemId}/entries", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ProductionEntryView addProductionEntry(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID itemId, @Valid @ModelAttribute ProductionEntryForm form) {
        return entries.add(user, itemId, form);
    }

    @DeleteMapping("/production/entries/{entryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductionEntry(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID entryId) {
        entries.delete(user, entryId);
    }
}
