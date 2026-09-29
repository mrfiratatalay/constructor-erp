package com.atalay.santiye.material;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Malzeme listesi Türkçe alfabeyle sıralanır: Ç, C'nin; İ, I'nın ardından gelir. Veritabanının kendi dili (en_US)
 * Çimento'yu Tuğla'nın arkasına atıyordu.
 */
@IntegrationTest
class MaterialOrderTest extends ApiTestSupport {

    @Test
    void theCatalogFollowsTheTurkishAlphabet() {
        Cookie storekeeper = signedInStorekeeper(loginAsOwner(), "Sıra Depocusu");
        String tag = " " + UUID.randomUUID().toString().substring(0, 8);
        for (String name : List.of("Tuğla", "Çimento", "İskele borusu", "Cıvata", "Izgara", "Çelik kalıp")) {
            assertThat(postJson("/api/materials", storekeeper, """
                {"name": "%s", "unit": "Adet", "active": true}
                """.formatted(name + tag))).hasStatus(201);
        }

        List<String> names = JsonPath.read(contentOf(get("/api/materials", storekeeper)), "$[*].name");
        assertThat(names.stream().filter(name -> name.endsWith(tag)).map(name -> name.replace(tag, "")))
            .containsExactly("Cıvata", "Çelik kalıp", "Çimento", "Izgara", "İskele borusu", "Tuğla");
    }
}
