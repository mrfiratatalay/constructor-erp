package com.atalay.santiye.production;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * İmalat (TASARIM.md "İmalat"): şef imalat açar ve günlük girer, sunucu gerçekleşeni, kalanı, yüzdeyi ve durumu
 * hesaplar. Patron, şef ve depo sorumlusu görür; veriyi yalnızca şef girer; çalışan hiç göremez.
 */
@IntegrationTest
class ProductionFlowTest extends ProductionTestSupport {

    @Test
    void theSiteLeadEntersTodaysWorkAndTheServerDoesTheMath() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Çamburnu Plaza");
        Cookie lead = signedInLead(owner, "Mehmet Şef");
        String itemId = itemOf(lead, siteId, "120", createCrew(lead, "Kaya Demir"));

        assertThat(addEntry(lead, itemId, Entry.today("55").on(TODAY.minusDays(1)))).hasStatus(201);
        assertThat(addEntry(lead, itemId, Entry.today("3.5"))).hasStatus(201);

        String board = board(owner, siteId);
        assertThat(number(board, "$.items[0].doneQuantity")).isEqualTo(58.5);
        assertThat(number(board, "$.items[0].remainingQuantity")).isEqualTo(61.5);
        assertThat(number(board, "$.items[0].percent")).isEqualTo(48.8);
        assertThat(number(board, "$.items[0].todayQuantity")).isEqualTo(3.5);
        assertThat(read(board, "$.items[0].crew.name")).isEqualTo("Kaya Demir");
        assertThat(read(board, "$.items[0].status")).isEqualTo("IN_PROGRESS");
        assertThat(read(board, "$.recentEntries[0].authorName")).isEqualTo("Mehmet Şef");
        assertThat(number(board, "$.recentEntries[0].quantity")).isEqualTo(3.5);
    }

    @Test
    void theStatusFollowsTheNumbersAndThePlannedEnd() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Durum Şantiyesi");
        Cookie lead = signedInLead(owner, "Durum Şefi");
        String nearly = itemOf(lead, siteId, "100", null);
        String done = itemOf(lead, siteId, "40", null);
        String late = read(contentOf(createItem(lead, siteId, """
            {"trade": "Sıva", "totalQuantity": 1000, "unit": "m²", "startDate": "%s", "plannedEnd": "%s"}"""
            .formatted(TODAY.minusDays(30), TODAY.minusDays(1)))), "$.id");

        addEntry(lead, nearly, Entry.today("90"));
        addEntry(lead, done, Entry.today("25"));
        addEntry(lead, done, Entry.today("15"));

        assertThat(read(detail(owner, nearly), "$.item.status")).isEqualTo("NEARLY_DONE");
        assertThat(read(detail(owner, done), "$.item.status")).isEqualTo("COMPLETED");
        assertThat(number(detail(owner, done), "$.item.remainingQuantity")).isZero();
        assertThat(read(detail(owner, late), "$.item.status")).isEqualTo("DELAYED");
    }

    @Test
    void onlyTheSiteLeadEntersDataAndWorkersSeeNothing() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Yetki Şantiyesi");
        Cookie lead = signedInLead(owner, "Yetki Şefi");
        Cookie keeper = signedInStorekeeper(owner, "Yetki Depocusu");
        Cookie worker = sessionCookieOf(join(joinToken(owner), null, "Yetki Ustası", uniquePhone()));
        String itemId = itemOf(lead, siteId, "10", null);
        String json = "{\"trade\": \"Boya\", \"totalQuantity\": 5, \"unit\": \"kat\"}";

        assertThat(createItem(owner, siteId, json)).hasStatus(403);
        assertThat(createItem(keeper, siteId, json)).hasStatus(403);
        assertThat(addEntry(owner, itemId, Entry.today("1"))).hasStatus(403);
        assertThat(addEntry(keeper, itemId, Entry.today("1"))).hasStatus(403);
        assertThat(get("/api/sites/%s/production".formatted(siteId), keeper)).hasStatus(200);
        assertThat(get("/api/sites/%s/production".formatted(siteId), worker)).hasStatus(403);
        assertThat(get("/api/production/items/" + itemId, worker)).hasStatus(403);
    }

    @Test
    void wrongItemsAndEntriesAreRejected() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Hata Şantiyesi");
        Cookie lead = signedInLead(owner, "Hata Şefi");
        String itemId = itemOf(lead, siteId, "10", null);

        assertThat(createItem(lead, siteId, """
            {"trade": "Boya", "totalQuantity": 0, "unit": "kat"}""")).hasStatus(400);
        assertThat(createItem(lead, siteId, """
            {"trade": "Boya", "totalQuantity": 5, "unit": "kat", "startDate": "2026-10-10", "plannedEnd": "2026-10-01"}
            """)).hasStatus(400);
        assertThat(createItem(lead, siteId, """
            {"trade": "Boya", "totalQuantity": 5, "unit": "kat", "crewId": "%s"}""".formatted(itemId)))
            .hasStatus(400);
        assertThat(addEntry(lead, itemId, Entry.today("1").on(TODAY.plusDays(1)))).hasStatus(400);
        assertThat(addEntry(lead, itemId, Entry.today("-1"))).hasStatus(400);
        assertThat(get("/api/sites/%s/production".formatted(UUID.randomUUID()), lead)).hasStatus(404);
    }
}
