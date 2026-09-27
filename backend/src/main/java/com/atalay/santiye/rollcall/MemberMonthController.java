package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.rollcall.dto.MemberMonthView;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.YearMonth;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Patron bir kişiye dokununca açılan takvim. Yalnızca patron. */
@RestController
@Tag(name = "Roll calls")
public class MemberMonthController {

    private final MemberMonths months;

    MemberMonthController(MemberMonths months) {
        this.months = months;
    }

    @GetMapping("/roll-calls/members/{userId}")
    public MemberMonthView getMemberRollCallMonth(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID userId,
        @Parameter(schema = @Schema(type = "string", example = "2026-09")) @RequestParam YearMonth month) {
        return months.month(user, userId, month);
    }
}
