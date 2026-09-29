package com.atalay.santiye.puantaj;

import com.atalay.santiye.billing.Features;
import com.atalay.santiye.billing.RequiresFeature;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.BulkMarkRequest;
import com.atalay.santiye.puantaj.dto.DayMarkView;
import com.atalay.santiye.puantaj.dto.MarkRequest;
import com.atalay.santiye.puantaj.dto.PuantajView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Yoklama (TASARIM.md "Yoklama"): firmanın puantajı. Yalnızca patron ve şef; çalışan bu menüyü görmez. */
@RequiresFeature(Features.ATTENDANCE)
@RestController
@RequestMapping("/puantaj")
@PreAuthorize("hasAnyRole('OWNER', 'SITE_LEAD')")
@Tag(name = "Puantaj")
public class PuantajController {

    private final PuantajQueries queries;
    private final PuantajMarks marks;

    PuantajController(PuantajQueries queries, PuantajMarks marks) {
        this.queries = queries;
        this.marks = marks;
    }

    @GetMapping
    public PuantajView getPuantaj(@AuthenticationPrincipal CurrentUser user,
        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate from,
        @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate to) {
        return queries.range(user, from, to);
    }

    @PutMapping("/days/{day}/entries/{entryId}")
    public DayMarkView markEntry(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = ISO.DATE) LocalDate day, @PathVariable UUID entryId,
        @Valid @RequestBody MarkRequest request) {
        return marks.mark(user, day, entryId, request);
    }

    @DeleteMapping("/days/{day}/entries/{entryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearMark(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = ISO.DATE) LocalDate day, @PathVariable UUID entryId) {
        marks.clear(user, day, entryId);
    }

    @PostMapping("/days/{day}/bulk")
    public List<DayMarkView> markEntries(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = ISO.DATE) LocalDate day, @Valid @RequestBody BulkMarkRequest request) {
        return marks.markAll(user, day, request);
    }
}
