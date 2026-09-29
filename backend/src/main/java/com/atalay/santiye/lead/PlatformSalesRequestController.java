package com.atalay.santiye.lead;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.lead.dto.FollowSalesRequest;
import com.atalay.santiye.lead.dto.SalesRequestView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Platform yönetimi: başvurular. Firmaya dönüştürme firma açılırken yapılır (CreateTenantRequest.salesRequestId). */
@RestController
@RequestMapping("/platform/sales-requests")
@Tag(name = "Platform")
public class PlatformSalesRequestController {

    private final SalesRequestQueries queries;
    private final SalesRequests requests;

    PlatformSalesRequestController(SalesRequestQueries queries, SalesRequests requests) {
        this.queries = queries;
        this.requests = requests;
    }

    @GetMapping
    public List<SalesRequestView> listSalesRequests() {
        return queries.all();
    }

    @PatchMapping("/{requestId}")
    public SalesRequestView followSalesRequest(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID requestId,
        @Valid @RequestBody FollowSalesRequest request) {
        requests.follow(requestId, request.status(), request.notes(), admin.userId());
        return queries.one(requestId);
    }
}
