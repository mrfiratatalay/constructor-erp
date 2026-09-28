package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Depo sorumlusu: patron Katılımcılar'dan seçer; çalışan gibi yoklamada sayılır, yoklama alamaz. */
@IntegrationTest
class StorekeeperRoleTest extends ApiTestSupport {

    @Test
    void theStorekeeperIsListedApartFromWorkers() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Depo Şantiyesi");
        Cookie keeper = signedInStorekeeper(owner, "Depocu Rıza");
        String keeperId = userIdOf(keeper);

        String site = contentOf(get("/api/sites/" + siteId, owner));
        List<String> keepers = JsonPath.read(site, "$.storekeepers[*].id");
        List<String> workers = JsonPath.read(site, "$.workers[*].id");

        assertThat(keepers).contains(keeperId);
        assertThat(workers).doesNotContain(keeperId);
        assertThat(read(contentOf(get("/api/auth/me", keeper)), "$.role")).isEqualTo("STOREKEEPER");
    }

    @Test
    void theStorekeeperIsCountedInPuantajButCannotTakeIt() {
        Cookie owner = loginAsOwner();
        Cookie keeper = signedInStorekeeper(owner, "Depocu Nuri");
        String today = LocalDate.now().toString();

        String puantaj = contentOf(get("/api/puantaj?from=%s&to=%s".formatted(today, today), owner));
        List<String> names = JsonPath.read(puantaj, "$.entries[?(@.archived == false)].name");

        assertThat(names).contains("Depocu Nuri");
        String mine = contentOf(get("/api/puantaj/me?month=" + YearMonth.now(), keeper));
        assertThat((Boolean) JsonPath.read(mine, "$.counted")).isTrue();
        assertThat(get("/api/puantaj?from=%s&to=%s".formatted(today, today), keeper)).hasStatus(403);
    }
}
