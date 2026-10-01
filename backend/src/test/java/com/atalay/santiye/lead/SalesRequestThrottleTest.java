package com.atalay.santiye.lead;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** Tanıtım sitesindeki başvuru formu herkese açıktır: aynı adresten saatte en fazla beş başvuru alınır. */
@IntegrationTest
class SalesRequestThrottleTest extends ApiTestSupport {

    @Test
    void theSixthApplicationFromTheSameAddressWithinAnHourIsRefused() {
        for (int i = 0; i < 5; i++) {
            assertThat(submitFrom("198.51.100.23")).hasStatus(201);
        }

        assertThat(submitFrom("198.51.100.23")).hasStatus(429);
        assertThat(submitFrom("198.51.100.24")).hasStatus(201);
    }

    private MvcTestResult submitFrom(String address) {
        String body = "{\"companyName\": \"Deneme Yapı\", \"contactName\": \"Ali Veli\", \"phone\": \"05321234567\"}";
        return mvc.post().uri("/api/public/sales-requests").contentType(MediaType.APPLICATION_JSON).content(body)
            .with(request -> {
                request.setRemoteAddr(address);
                return request;
            })
            .exchange();
    }
}
