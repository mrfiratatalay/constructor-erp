package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.rollcall.dto.MarkMemberRequest;
import com.atalay.santiye.rollcall.dto.RollCallDayView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Patronun Yoklama ekranı: günün kişileri; katılmayanı işaretlemek. Yalnızca patron. */
@RestController
@RequestMapping("/roll-calls/days/{day}")
@Tag(name = "Roll calls")
public class RollCallDayController {

    private final RollCallDays days;

    RollCallDayController(RollCallDays days) {
        this.days = days;
    }

    @GetMapping
    public RollCallDayView getRollCallDay(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        return days.day(user, day);
    }

    /** Günün listesinin tamamı döner: sayılar ve bölümler tek cevapta tazelenir. */
    @PutMapping("/members/{userId}")
    public RollCallDayView markRollCallMember(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day, @PathVariable UUID userId,
        @Valid @RequestBody MarkMemberRequest request) {
        return days.mark(user, day, userId, request);
    }
}
