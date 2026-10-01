package com.atalay.santiye.common;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;

/** Listeli istekler sınırlıdır: tek istekle sunucuya on binlerce satır işletilemez. */
@IntegrationTest
class RequestListLimitsTest extends ApiTestSupport {

    @Test
    void aShipmentCarriesAtMostAHundredLines() {
        String lines = rows(101, "{\"materialId\": \"%s\", \"quantity\": 1}");
        String body = "{\"id\": \"%s\", \"sourceId\": \"%s\", \"partyName\": \"Komşu\", \"expectsReturn\": false, "
            .formatted(UUID.randomUUID(), UUID.randomUUID()) + "\"lines\": [" + lines + "]}";

        assertThat(postJson("/api/shipments", loginAsOwner(), body)).hasStatus(400);
    }

    @Test
    void anAttendanceDayHasAtMostAThousandRows() {
        Cookie owner = loginAsOwner();
        String site = createSite(owner, "Kalabalık Şantiye " + UUID.randomUUID());
        String day = LocalDate.now(ZoneId.of("Europe/Istanbul")).toString();
        String body = "{\"entries\": [" + rows(1001, "{\"workerId\": \"%s\", \"status\": \"PRESENT\"}") + "]}";

        assertThat(postJson("/api/sites/%s/attendance/%s".formatted(site, day), owner, body)).hasStatus(400);
    }

    private static String rows(int count, String row) {
        return IntStream.range(0, count).mapToObj(i -> row.formatted(UUID.randomUUID()))
            .collect(Collectors.joining(","));
    }
}
