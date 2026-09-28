package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.RosterEntryRequest;
import com.atalay.santiye.puantaj.dto.RosterEntryView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Yoklama listesine uygulaması olmayan bir kişiyi ya da taşeron ekibi eklemek, düzeltmek, listeden çıkarmak. */
@RestController
@RequestMapping("/puantaj/entries")
@PreAuthorize("hasAnyRole('OWNER', 'SITE_LEAD')")
@Tag(name = "Puantaj")
public class RosterController {

    private final RosterService roster;

    RosterController(RosterService roster) {
        this.roster = roster;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RosterEntryView addRosterEntry(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody RosterEntryRequest request) {
        return roster.add(user, request);
    }

    @PatchMapping("/{entryId}")
    public RosterEntryView updateRosterEntry(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID entryId,
        @Valid @RequestBody RosterEntryRequest request) {
        return roster.update(user, entryId, request);
    }

    @DeleteMapping("/{entryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void archiveRosterEntry(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID entryId) {
        roster.archive(user, entryId);
    }
}
