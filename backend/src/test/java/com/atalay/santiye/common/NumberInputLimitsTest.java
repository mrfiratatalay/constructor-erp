package com.atalay.santiye.common;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TenantTestSupport;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;

/**
 * "1e999999999" gibi kısa ama devasa sayılar: BigDecimal'le bölmek ya da metne çevirmek milyarlarca basamak
 * hesaplatır ve sunucuyu kilitler. Böyle sayılar doğrulamada, hesaba girmeden reddedilir.
 */
@IntegrationTest
class NumberInputLimitsTest extends TenantTestSupport {

    @Test
    @Timeout(30)
    void aHugeOvertimeIsRefusedRightAway() {
        Cookie owner = loginAsOwner();
        String person = "{\"kind\": \"PERSON\", \"name\": \"Mesai Ustası\"}";
        String entry = read(contentOf(postJson("/api/puantaj/entries", owner, person)), "$.id");
        String mark = "/api/puantaj/days/" + LocalDate.now(ZoneId.of("Europe/Istanbul")) + "/entries/" + entry;

        assertThat(putJson(mark, owner, "{\"status\": \"PRESENT\", \"overtimeHours\": 1e999999999}")).hasStatus(400);
        assertThat(putJson(mark, owner, "{\"status\": \"PRESENT\", \"overtimeHours\": 2.5}")).hasStatusOk();
    }

    @Test
    @Timeout(30)
    void aHugePaymentIsRefusedRightAway() {
        String company = openTenant().companyId();
        String payment = "{\"amount\": 1e999999999, \"method\": \"CASH\", \"paidOn\": \"2026-10-01\"}";

        assertThat(postJson("/api/platform/tenants/" + company + "/payments", loginAsPlatformAdmin(), payment))
            .hasStatus(400);
    }
}
