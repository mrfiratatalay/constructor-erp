package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.MyPuantajView;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.YearMonth;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Puantajım: oturumu açık kişinin kendi ayı. Herkes yalnızca kendini görür; başkasının kaydı buradan gelmez. */
@RestController
@Tag(name = "Puantaj")
public class MyPuantajController {

    private final MyPuantaj mine;

    MyPuantajController(MyPuantaj mine) {
        this.mine = mine;
    }

    @GetMapping("/puantaj/me")
    public MyPuantajView getMyPuantaj(@AuthenticationPrincipal CurrentUser user,
        @Parameter(schema = @Schema(type = "string", example = "2026-09")) @RequestParam YearMonth month) {
        return mine.month(user, month);
    }
}
