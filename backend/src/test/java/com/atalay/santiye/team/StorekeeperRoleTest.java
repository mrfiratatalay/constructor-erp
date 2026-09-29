package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * Depo sorumlusu (WAREHOUSE): patron Katılımcılar'dan seçer. Yoklamada sayılmaz, yoklama alamaz; ilerlemeyi görür,
 * girmez (izinleri: VIEW_PRODUCTION var, MANAGE_PRODUCTION yok).
 */
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
        String me = contentOf(get("/api/auth/me", keeper));
        List<String> permissions = JsonPath.read(me, "$.permissions");

        assertThat(keepers).contains(keeperId);
        assertThat(workers).doesNotContain(keeperId);
        assertThat(read(me, "$.role")).isEqualTo("WAREHOUSE");
        assertThat(permissions).contains("VIEW_PRODUCTION").doesNotContain("MANAGE_PRODUCTION");
    }

    @Test
    void theStorekeeperIsNotCountedInPuantajAndCannotTakeIt() {
        Cookie owner = loginAsOwner();
        Cookie keeper = signedInStorekeeper(owner, "Depocu Nuri");
        String today = LocalDate.now().toString();

        String puantaj = contentOf(get("/api/puantaj?from=%s&to=%s".formatted(today, today), owner));
        List<String> names = JsonPath.read(puantaj, "$.entries[?(@.archived == false)].name");

        assertThat(names).doesNotContain("Depocu Nuri");
        assertThat(get("/api/puantaj?from=%s&to=%s".formatted(today, today), keeper)).hasStatus(403);
    }
}
