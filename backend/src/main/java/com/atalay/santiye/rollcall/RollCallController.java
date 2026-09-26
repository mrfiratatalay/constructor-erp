package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.RollCallPosts;
import com.atalay.santiye.post.dto.PostView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/** Sohbetteki yoklama mesajı: şef sabah atar, çalışan kendi telefonundan "Yoklamaya Katıl"a basar. */
@RestController
@Tag(name = "Roll calls")
public class RollCallController {

    private final RollCallPosts rollCallPosts;

    RollCallController(RollCallPosts rollCallPosts) {
        this.rollCallPosts = rollCallPosts;
    }

    /** Sohbetteki ＋ → Yoklama: şantiyenin bugünkü yoklama mesajı; zaten atılmışsa aynısı döner. */
    @PostMapping("/sites/{siteId}/roll-calls")
    public PostView openTodaysRollCall(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return rollCallPosts.openToday(user, siteId);
    }
}
