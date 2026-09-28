package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.AdjustmentRequest;
import com.atalay.santiye.material.dto.CancelMovementRequest;
import com.atalay.santiye.material.dto.DocumentUploadForm;
import com.atalay.santiye.material.dto.DocumentView;
import com.atalay.santiye.material.dto.MovementDetail;
import com.atalay.santiye.material.dto.MovementUpdateRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Kaydedilmiş hareketin adımları: teslim almak, iptal etmek, notlarını düzeltmek, belge eklemek; sayım düzeltmesi. */
@RestController
@Tag(name = "Materials")
public class MovementActionController {

    private final MovementActions actions;
    private final MaterialDocuments documents;
    private final StockAdjustments adjustments;

    MovementActionController(MovementActions actions, MaterialDocuments documents, StockAdjustments adjustments) {
        this.actions = actions;
        this.documents = documents;
        this.adjustments = adjustments;
    }

    @PostMapping("/material-movements/{movementId}/deliver")
    @PreAuthorize("hasAuthority('CONFIRM_DELIVERY')")
    public MovementDetail deliverMovement(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID movementId) {
        return actions.deliver(user, movementId);
    }

    @PostMapping("/material-movements/{movementId}/cancel")
    @PreAuthorize("hasAuthority('CANCEL_MATERIAL_MOVEMENT')")
    public MovementDetail cancelMovement(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID movementId,
        @Valid @RequestBody CancelMovementRequest request) {
        return actions.cancel(user, movementId, request.reason());
    }

    @PatchMapping("/material-movements/{movementId}")
    @PreAuthorize("hasAuthority('UPDATE_MATERIAL_MOVEMENT')")
    public MovementDetail updateMovement(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID movementId,
        @Valid @RequestBody MovementUpdateRequest request) {
        return actions.update(user, movementId, request);
    }

    @PostMapping(value = "/material-movements/{movementId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public List<DocumentView> attachDocuments(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID movementId, @Valid @ModelAttribute DocumentUploadForm form) {
        return documents.attach(user, movementId, form.files());
    }

    @PostMapping("/stock-adjustments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('STOCK_ADJUSTMENT')")
    public MovementDetail adjustStock(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody AdjustmentRequest request) {
        return adjustments.adjust(user, request);
    }
}
