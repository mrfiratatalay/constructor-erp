package com.atalay.santiye.production;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** İmalat testlerinin ortak adımları: şef taşeron ekler, imalat açar, günlük giriş yapar (telefonun yaptığı gibi). */
abstract class ProductionTestSupport extends ApiTestSupport {

    /** Sunucunun "bugün"ü firmanın saatine göredir (app.timezone); test de aynı günü kullanır. */
    protected static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));

    /** Günlük girişin alanları; kimliği istemci üretir. */
    record Entry(String id, LocalDate day, String quantity, boolean onField) {

        static Entry today(String quantity) {
            return new Entry(UUID.randomUUID().toString(), TODAY, quantity, false);
        }

        Entry on(LocalDate otherDay) {
            return new Entry(id, otherDay, quantity, onField);
        }

        Entry toField() {
            return new Entry(id, day, quantity, true);
        }
    }

    /** Şef yoklama listesine taşeron ekibi ekler (puantajın ekibi imalatın taşeronudur). */
    protected String createCrew(Cookie lead, String name) {
        String json = "{\"kind\": \"CREW\", \"name\": \"%s\", \"trade\": \"Demirci\"}".formatted(name);
        MvcTestResult result = postJson("/api/puantaj/entries", lead, json);
        assertThat(result).hasStatus(201);
        return read(contentOf(result), "$.id");
    }

    protected MvcTestResult createItem(Cookie session, String siteId, String json) {
        return postJson("/api/sites/%s/production/items".formatted(siteId), session, json);
    }

    /** "Demir İşleri · 120 ton" gibi bir imalat açar; kimliğini döner. */
    protected String itemOf(Cookie lead, String siteId, String total, String crewId) {
        String crew = crewId == null ? "null" : "\"" + crewId + "\"";
        String json = "{\"trade\": \"Demir İşleri\", \"crewId\": %s, \"totalQuantity\": %s, \"unit\": \"ton\"}"
            .formatted(crew, total);
        MvcTestResult result = createItem(lead, siteId, json);
        assertThat(result).hasStatus(201);
        return read(contentOf(result), "$.id");
    }

    protected MvcTestResult addEntry(Cookie session, String itemId, Entry entry, MockMultipartFile... files) {
        var request = mvc.post().uri("/api/production/items/%s/entries".formatted(itemId)).multipart().cookie(session)
            .param("id", entry.id()).param("day", entry.day().toString()).param("quantity", entry.quantity())
            .param("onField", String.valueOf(entry.onField()));
        for (MockMultipartFile file : files) {
            request.file(file);
        }
        return request.exchange();
    }

    protected String board(Cookie session, String siteId) {
        MvcTestResult result = get("/api/sites/%s/production".formatted(siteId), session);
        assertThat(result).hasStatus(200);
        return contentOf(result);
    }

    protected String detail(Cookie session, String itemId) {
        MvcTestResult result = get("/api/production/items/" + itemId, session);
        assertThat(result).hasStatus(200);
        return contentOf(result);
    }

    /** JSON sayısı (BigDecimal ya da double) ekrandaki gibi karşılaştırılır. */
    protected static double number(String json, String path) {
        return ((Number) JsonPath.read(json, path)).doubleValue();
    }
}
