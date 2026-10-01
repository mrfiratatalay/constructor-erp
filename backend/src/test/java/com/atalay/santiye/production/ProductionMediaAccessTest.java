package com.atalay.santiye.production;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TestMedia;
import jakarta.servlet.http.Cookie;
import java.time.Duration;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Saha'ya yansıtılmamış imalat fotoğrafı yalnızca ilerlemeyi görenlerindir (patron, şef, depo). Adresini ele geçiren
 * bir çalışan da açamaz: dosya ona "bulunamadı" döner.
 */
@IntegrationTest
class ProductionMediaAccessTest extends ProductionTestSupport {

    @Test
    void aPhotoKeptInProductionOpensOnlyForThoseWhoSeeProduction() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Gizli İmalat " + UUID.randomUUID());
        Cookie lead = signedInLead(owner, "İmalat Şefi");
        Cookie worker = sessionCookieOf(join(joinToken(owner), null, "Meraklı Çalışan", uniquePhone()));
        String itemId = itemOf(lead, siteId, "10", null);
        assertThat(addEntry(lead, itemId, Entry.today("1"), TestMedia.photo())).hasStatus(201);
        await().atMost(Duration.ofSeconds(60)).pollInterval(Duration.ofMillis(250))
            .until(() -> "READY".equals(read(detail(lead, itemId), "$.entries[0].media[0].status")));
        String url = read(detail(lead, itemId), "$.entries[0].media[0].url");

        assertThat(get(url, worker)).hasStatus(404);
        assertThat(get(url + "/thumbnail", worker)).hasStatus(404);
        assertThat(get(url, lead)).hasStatusOk();
        assertThat(get(url, owner)).hasStatusOk();
    }
}
