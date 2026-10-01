package com.atalay.santiye.lead;

import com.atalay.santiye.common.web.ClientAddress;
import com.atalay.santiye.lead.dto.SalesRequestSubmission;
import com.atalay.santiye.lead.dto.SubmittedSalesRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Tanıtım sitesi: "Paketi seç" / "Demo iste" başvurusu (oturum gerekmez; ödeme alınmaz). */
@RestController
@Tag(name = "Public")
public class PublicSalesRequestController {

    private final SalesRequests requests;
    private final SubmissionThrottle throttle;

    PublicSalesRequestController(SalesRequests requests, SubmissionThrottle throttle) {
        this.requests = requests;
        this.throttle = throttle;
    }

    @PostMapping("/public/sales-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public SubmittedSalesRequest submitSalesRequest(@Valid @RequestBody SalesRequestSubmission submission,
        HttpServletRequest http) {
        if (submission.website() != null && !submission.website().isBlank()) {
            return new SubmittedSalesRequest(UUID.randomUUID());
        }
        throttle.check(ClientAddress.of(http));
        return new SubmittedSalesRequest(requests.submit(formOf(submission)).getId());
    }

    private static SalesRequestForm formOf(SalesRequestSubmission s) {
        return new SalesRequestForm(s.companyName().trim(), s.contactName().trim(), s.phone().trim(),
            blankToNull(s.email()), blankToNull(s.city()), s.siteCount(), s.planId(), blankToNull(s.message()));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
