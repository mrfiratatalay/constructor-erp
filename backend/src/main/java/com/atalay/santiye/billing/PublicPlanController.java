package com.atalay.santiye.billing;

import com.atalay.santiye.billing.dto.PublicPlanView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Tanıtım sitesi: paketler ve fiyatlar (oturum gerekmez). */
@RestController
@Tag(name = "Public")
public class PublicPlanController {

    private final PublicPlans plans;

    PublicPlanController(PublicPlans plans) {
        this.plans = plans;
    }

    @GetMapping("/public/plans")
    public List<PublicPlanView> listPublicPlans() {
        return plans.list();
    }
}
