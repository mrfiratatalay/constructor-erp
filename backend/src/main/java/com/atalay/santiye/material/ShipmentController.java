package com.atalay.santiye.material;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.CancelRequest;
import com.atalay.santiye.material.dto.DocumentUploadForm;
import com.atalay.santiye.material.dto.DocumentView;
import com.atalay.santiye.material.dto.FieldShipmentRef;
import com.atalay.santiye.material.dto.ShipmentDetail;
import com.atalay.santiye.material.dto.ShipmentEditRequest;
import com.atalay.santiye.material.dto.ShipmentRequest;
import com.atalay.santiye.material.dto.ShipmentRow;
import com.atalay.santiye.material.dto.StockLevel;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Sevkiyatlar: liste, ayrıntı, çıkarma, teslim alma ve iptal. Stok yalnızca bir yerin kalan miktarı olarak sorulur. */
@RequiresFeature(Features.MATERIALS)
@RestController
@RequestMapping("/shipments")
@Tag(name = "Shipments")
public class ShipmentController {

    private final Shipments shipments;
    private final ShipmentActions actions;
    private final ShipmentReturns returns;
    private final ShipmentRows rows;
    private final ShipmentDetails details;
    private final Stock stock;
    private final MaterialDocuments documents;
    private final FieldShipments fieldShipments;

    ShipmentController(Shipments shipments, ShipmentActions actions, ShipmentReturns returns, ShipmentParts parts) {
        this.shipments = shipments;
        this.actions = actions;
        this.returns = returns;
        this.rows = parts.rows();
        this.details = parts.details();
        this.stock = parts.stock();
        this.documents = parts.documents();
        this.fieldShipments = parts.fieldShipments();
    }

    /** Tek liste: süzgeç yoktur, yalnızca arama. Sıralama en yeniden eskiye. */
    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<ShipmentRow> listShipments(@AuthenticationPrincipal CurrentUser user,
        @RequestParam(required = false) @Nullable String search) {
        return rows.list(user, search);
    }

    @GetMapping("/{shipmentId}")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public ShipmentDetail getShipment(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID shipmentId) {
        return details.of(user, shipmentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public ShipmentDetail createShipment(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody ShipmentRequest request) {
        return details.of(user, shipments.create(user, request));
    }

    @PatchMapping("/{shipmentId}")
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public ShipmentDetail editShipment(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID shipmentId,
        @Valid @RequestBody ShipmentEditRequest request) {
        actions.edit(user, shipmentId, request);
        return details.of(user, shipmentId);
    }

    @PostMapping("/{shipmentId}/cancellation")
    @PreAuthorize("hasAuthority('CANCEL_MATERIAL_MOVEMENT')")
    public ShipmentDetail cancelShipment(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID shipmentId,
        @Valid @RequestBody CancelRequest request) {
        actions.cancel(user, shipmentId, request);
        return details.of(user, shipmentId);
    }

    /** Dışarıdaki malzeme geri geldi: malzeme, firma ve dönüş yeri çıkışın kendisinden gelir. */
    @PostMapping("/{shipmentId}/return")
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public ShipmentDetail receiveShipmentReturn(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID shipmentId) {
        return details.of(user, returns.receive(user, shipmentId));
    }

    /** İrsaliye: depoda kamyon yüklenirken telefonla çekilen fotoğraf ya da PDF. */
    @PostMapping(value = "/{shipmentId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public List<DocumentView> attachShipmentDocuments(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID shipmentId, @Valid @ModelAttribute DocumentUploadForm form) {
        return documents.attach(user, shipmentId, form.files());
    }

    /** Şantiyenin Saha akışındaki malzeme kartları: gönderi referanstır, durumu sevkiyattan okunur. */
    @GetMapping("/field-refs")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<FieldShipmentRef> listFieldShipmentRefs(@AuthenticationPrincipal CurrentUser user,
        @RequestParam UUID siteId) {
        return fieldShipments.ofSite(user, siteId);
    }

    /** Sevkiyat formunda malzemenin altındaki tek satır: "Depoda: 300 Torba". */
    @GetMapping("/stock")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public List<StockLevel> listStockAt(@AuthenticationPrincipal CurrentUser user, @RequestParam UUID placeId) {
        return stock.at(user, placeId);
    }
}
