package com.atalay.santiye.platform;

import com.atalay.santiye.audit.AuditEntryView;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.platform.dto.PlatformDashboardView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/platform")
@Tag(name = "Platform")
public class PlatformDashboardController {

    private static final int MAX_AUDIT = 200;

    private final PlatformDashboard dashboard;
    private final PlatformAudit audit;

    PlatformDashboardController(PlatformDashboard dashboard, PlatformAudit audit) {
        this.dashboard = dashboard;
        this.audit = audit;
    }

    @GetMapping("/dashboard")
    public PlatformDashboardView getPlatformDashboard() {
        return dashboard.summary();
    }

    @GetMapping("/audit")
    public List<AuditEntryView> listPlatformAudit(@RequestParam(defaultValue = "100") int limit) {
        return audit.recent(Math.clamp(limit, 1, MAX_AUDIT));
    }
}
