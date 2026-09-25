package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.CreateWorkerRequest;
import com.atalay.santiye.attendance.dto.WorkerView;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Personel şantiyeye aittir: şantiyenin altında listelenir ve eklenir. */
@RestController
@Tag(name = "Attendance")
public class SiteWorkerController {

    private final SiteWorkers workers;

    SiteWorkerController(SiteWorkers workers) {
        this.workers = workers;
    }

    @GetMapping("/sites/{siteId}/workers")
    public List<WorkerView> listSiteWorkers(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return workers.listWorkers(user, siteId);
    }

    @PostMapping("/sites/{siteId}/workers")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkerView addSiteWorker(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @Valid @RequestBody CreateWorkerRequest request) {
        return workers.addWorker(user, siteId, request);
    }
}
