package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.RollCallPosts;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.rollcall.dto.RollCallView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/** Sohbetteki yoklama mesajı: şef sabah atar, çalışan kendi telefonundan "Yoklamaya Katıl"a basar. */
@RestController
@Tag(name = "Roll calls")
public class RollCallController {

    private final RollCallPosts rollCallPosts;
    private final RollCallCheckIns checkIns;

    RollCallController(RollCallPosts rollCallPosts, RollCallCheckIns checkIns) {
        this.rollCallPosts = rollCallPosts;
        this.checkIns = checkIns;
    }

    /** Sohbetteki ＋ → Yoklama: şantiyenin bugünkü yoklama mesajı; zaten atılmışsa aynısı döner. */
    @PostMapping("/sites/{siteId}/roll-calls")
    public PostView openTodaysRollCall(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return rollCallPosts.openToday(user, siteId);
    }

    /** Mesajın altındaki kart: kaç kişi katıldı, bakan kişi katıldı mı. */
    @GetMapping("/roll-calls/{postId}")
    public RollCallView getRollCall(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return checkIns.view(user, postId);
    }

    @PostMapping("/roll-calls/{postId}/check-in")
    public RollCallView checkInToRollCall(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return checkIns.checkIn(user, postId);
    }
}
