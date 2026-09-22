package com.atalay.santiye.today;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.today.dto.TodayView;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Today")
public class TodayController {

    private final TodayService today;

    TodayController(TodayService today) {
        this.today = today;
    }

    @GetMapping("/today")
    public TodayView getToday(@AuthenticationPrincipal CurrentUser user) {
        return today.today(user);
    }
}
