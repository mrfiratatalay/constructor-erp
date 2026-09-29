package com.atalay.santiye.production;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TestMedia;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

/**
 * Günlük girişin dosyaları ve Saha: yansıtılmayan giriş yalnızca imalatta görünür; şef "Saha akışına yansıt"
 * dediyse Saha'ya fotoğrafıyla sıradan bir güncelleme düşer. Giriş silinince hesaptan düşer, Saha'dan çekilir.
 */
@IntegrationTest
class ProductionEntryTest extends ProductionTestSupport {

    @Test
    void photosStayInProductionUnlessTheLeadReflectsTheEntryToSaha() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Saha Şantiyesi");
        Cookie lead = signedInLead(owner, "Saha Şefi");
        String itemId = itemOf(lead, siteId, "120", null);

        assertThat(addEntry(lead, itemId, Entry.today("2"), TestMedia.photo())).hasStatus(201);
        assertThat(fieldBodies(owner, siteId)).isEmpty();

        assertThat(addEntry(lead, itemId, Entry.today("1.5").toField(), TestMedia.photo())).hasStatus(201);
        String field = fieldUpdates(owner, siteId);
        assertThat(fieldBodies(owner, siteId)).containsExactly("📐 İlerleme · Demir İşleri: +1,5 ton · 3,5 / 120 ton (%2,9)");
        assertThat(JsonPath.<List<Object>>read(field, "$.items[0].media")).hasSize(1);

        String detail = detail(owner, itemId);
        assertThat(JsonPath.<List<Object>>read(detail, "$.entries[*].media[*]")).hasSize(2);
        assertThat(JsonPath.<List<Boolean>>read(detail, "$.entries[*].onField")).containsExactlyInAnyOrder(true, false);
    }

    @Test
    void onlyPhotosAndPdfsAreAttached() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Dosya Şantiyesi");
        Cookie lead = signedInLead(owner, "Dosya Şefi");
        String itemId = itemOf(lead, siteId, "10", null);
        var pdf = new MockMultipartFile("files", "tutanak.pdf", "application/pdf", "%PDF-1.4".getBytes());

        assertThat(addEntry(lead, itemId, Entry.today("1"), TestMedia.portraitVideo())).hasStatus(400);
        assertThat(addEntry(lead, itemId, Entry.today("1"), pdf)).hasStatus(201);
        assertThat(number(detail(owner, itemId), "$.item.doneQuantity")).isEqualTo(1);
    }

    @Test
    void deletingAnEntryDropsItFromTheTotalsAndRetractsItsSahaPost() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Silme Şantiyesi");
        Cookie lead = signedInLead(owner, "Silme Şefi");
        String itemId = itemOf(lead, siteId, "50", null);
        addEntry(lead, itemId, Entry.today("10"));
        String wrong = read(contentOf(addEntry(lead, itemId, Entry.today("7").toField())), "$.id");

        assertThat(delete("/api/production/entries/" + wrong, owner)).hasStatus(403);
        assertThat(delete("/api/production/entries/" + wrong, lead)).hasStatus(204);

        assertThat(number(detail(owner, itemId), "$.item.doneQuantity")).isEqualTo(10);
        assertThat((Object) JsonPath.read(fieldUpdates(owner, siteId), "$.items[0].deletion")).isNotNull();
        assertThat(delete("/api/production/entries/" + wrong, lead)).hasStatus(404);
    }

    @Test
    void aRepeatedRequestIsCountedOnce() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Tekrar Şantiyesi");
        Cookie lead = signedInLead(owner, "Tekrar Şefi");
        String itemId = itemOf(lead, siteId, "10", null);
        Entry entry = Entry.today("4");

        assertThat(addEntry(lead, itemId, entry)).hasStatus(201);
        assertThat(addEntry(lead, itemId, entry)).hasStatus(201);

        assertThat(number(detail(owner, itemId), "$.item.doneQuantity")).isEqualTo(4);
        assertThat(JsonPath.<List<Object>>read(detail(owner, itemId), "$.entries")).hasSize(1);
    }

    @Test
    void anItemWithEntriesIsKeptUntilItsEntriesAreDeleted() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kalem Şantiyesi");
        Cookie lead = signedInLead(owner, "Kalem Şefi");
        String itemId = itemOf(lead, siteId, "10", null);
        String entryId = read(contentOf(addEntry(lead, itemId, Entry.today("2"))), "$.id");

        assertThat(delete("/api/production/items/" + itemId, lead)).hasStatus(409);
        assertThat(delete("/api/production/entries/" + entryId, lead)).hasStatus(204);
        assertThat(delete("/api/production/items/" + itemId, lead)).hasStatus(204);

        assertThat(JsonPath.<List<Object>>read(board(owner, siteId), "$.items")).isEmpty();
        assertThat(get("/api/production/items/" + itemId, owner)).hasStatus(404);
    }

    private String fieldUpdates(Cookie session, String siteId) {
        return contentOf(get("/api/posts/field-updates?siteId=" + siteId, session));
    }

    private List<String> fieldBodies(Cookie session, String siteId) {
        return JsonPath.read(fieldUpdates(session, siteId), "$.items[?(@.deletion == null)].body");
    }
}
