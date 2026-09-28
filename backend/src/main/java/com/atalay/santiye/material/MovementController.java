package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MaterialSummary;
import com.atalay.santiye.material.dto.MovementDetail;
import com.atalay.santiye.material.dto.MovementFilter;
import com.atalay.santiye.material.dto.MovementPage;
import com.atalay.santiye.material.dto.MovementPaging;
import com.atalay.santiye.material.dto.MovementRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Malzeme hareketleri: liste (süzgeçli, sayfalı), özet kartları, ayrıntı ve yeni hareket. */
@RestController
@RequestMapping("/material-movements")
@Tag(name = "Materials")
public class MovementController {

    private final MovementSearch search;
    private final MaterialSummaries summaries;
    private final MovementDetails details;
    private final MovementRecorder recorder;

    MovementController(MovementSearch search, MaterialSummaries summaries, MovementDetails details,
        MovementRecorder recorder) {
        this.search = search;
        this.summaries = summaries;
        this.details = details;
        this.recorder = recorder;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public MovementPage listMaterialMovements(@AuthenticationPrincipal CurrentUser user,
        @ParameterObject MovementFilter filter, @ParameterObject MovementPaging paging) {
        return search.page(user, filter, paging);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public MaterialSummary getMaterialSummary(@AuthenticationPrincipal CurrentUser user) {
        return summaries.of(user);
    }

    @GetMapping("/{movementId}")
    @PreAuthorize("hasAuthority('VIEW_MATERIALS')")
    public MovementDetail getMaterialMovement(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID movementId) {
        return details.of(user, movementId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('CREATE_MATERIAL_MOVEMENT')")
    public MovementDetail createMaterialMovement(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody MovementRequest request) {
        return recorder.record(user, request);
    }
}
