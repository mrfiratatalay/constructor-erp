package com.atalay.santiye.attendance;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

@IntegrationTest
class AttendanceDayTest extends ApiTestSupport {

    /** Uygulamanın "bugün"ü şantiyenin saatine göredir (app.timezone). */
    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));
    private static final DateTimeFormatter DAY_NAME = DateTimeFormatter.ofPattern("d MMMM", Locale.forLanguageTag("tr"));

    /** Yoklamada bir kişinin işareti; testte yalnızca durum ve neden değişir. */
    private record Mark(String workerId, String status, String reason) {

        String json() {
            String why = reason == null ? "null" : "\"" + reason + "\"";
            return "{\"workerId\": \"%s\", \"status\": \"%s\", \"reason\": %s, \"note\": \"Sabah aradı\"}"
                .formatted(workerId, status, why);
        }
    }

    private static String body(Mark... marks) {
        return Arrays.stream(marks).map(Mark::json).collect(Collectors.joining(", ", "{\"entries\": [", "]}"));
    }

    private static String dayOf(String siteId, LocalDate day) {
        return "/api/sites/" + siteId + "/attendance/" + day;
    }

    private String addWorker(Cookie session, String siteId, String fullName) {
        String json = "{\"fullName\": \"%s\"}".formatted(fullName);
        return read(contentOf(postJson("/api/sites/" + siteId + "/workers", session, json)), "$.id");
    }

    @Test
    void everyoneCameExceptOneWhoIsSick() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Yoklama " + UUID.randomUUID());
        String ali = addWorker(owner, siteId, "Ali Usta");
        String veli = addWorker(owner, siteId, "Veli Kaya");

        assertThat(postJson(dayOf(siteId, TODAY), owner, body(new Mark(ali, "PRESENT", null), new Mark(veli, "ABSENT", "SICK"))))
            .hasStatus(201).bodyJson().extractingPath("$.counts.absent").isEqualTo(1);

        String day = contentOf(get(dayOf(siteId, TODAY), owner));
        assertThat(read(day, "$.recordedByName")).isEqualTo("Patron");
        assertThat(read(day, "$.entries[1].worker.fullName")).isEqualTo("Veli Kaya");
        assertThat(read(day, "$.entries[1].reason")).isEqualTo("SICK");
        assertThat(read(day, "$.entries[1].note")).isEqualTo("Sabah aradı");
    }

    @Test
    void aDayIsTakenOnceAndCorrectedByEditing() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Tek yoklama " + UUID.randomUUID());
        String veli = addWorker(owner, siteId, "Veli Kaya");
        postJson(dayOf(siteId, TODAY), owner, body(new Mark(veli, "ABSENT", "UNEXCUSED")));

        assertThat(postJson(dayOf(siteId, TODAY), owner, body(new Mark(veli, "PRESENT", null))))
            .hasStatus(409).bodyJson().extractingPath("$.detail")
            .isEqualTo(DAY_NAME.format(TODAY) + " yoklaması zaten alınmış.");
        assertThat(putJson(dayOf(siteId, TODAY), owner, body(new Mark(veli, "PRESENT", null))))
            .hasStatusOk().bodyJson().extractingPath("$.counts.present").isEqualTo(1);
        assertThat(get(dayOf(siteId, TODAY), owner)).bodyJson().extractingPath("$.entries[0].reason").isNull();
    }

    @Test
    void aDayWithoutAttendanceComesBackEmpty() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Boş gün " + UUID.randomUUID());

        String day = contentOf(get(dayOf(siteId, TODAY.minusDays(1)), owner));
        assertThat(read(day, "$.day")).isEqualTo(TODAY.minusDays(1).toString());
        assertThat(day).contains("\"recordedAt\":null").contains("\"entries\":[]");
    }

    @Test
    void invalidListsAreRejected() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Hatalı " + UUID.randomUUID());
        String otherSite = createSite(owner, "Öteki " + UUID.randomUUID());
        String veli = addWorker(owner, siteId, "Veli Kaya");
        String stranger = addWorker(owner, otherSite, "Yabancı Usta");

        assertThat(postJson(dayOf(siteId, TODAY.plusDays(1)), owner, body(new Mark(veli, "PRESENT", null)))).hasStatus(400);
        assertThat(postJson(dayOf(siteId, TODAY), owner, body(new Mark(veli, "ABSENT", null))))
            .hasStatus(400).bodyJson().extractingPath("$.detail").isEqualTo("Gelmeyen kişinin nedenini seç.");
        assertThat(postJson(dayOf(siteId, TODAY), owner, body(new Mark(stranger, "PRESENT", null)))).hasStatus(400);
        assertThat(postJson(dayOf(siteId, TODAY), owner, body(new Mark(veli, "EXCUSED", "SICK"))))
            .hasStatus(201).bodyJson().extractingPath("$.entries[0].reason").isNull();
    }

    /** Firmadaki şef de yoklama alır (herkes her şantiyededir); bulunmayan şantiyenin yoklaması 404'tür. */
    @Test
    void aSiteLeadTakesAttendanceButAnUnknownSiteIsNotFound() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Şefin yoklaması " + UUID.randomUUID());
        String ali = addWorker(owner, siteId, "Ali Usta");
        Cookie lead = signedInLead(owner, "Yoklamacı Şef");

        assertThat(postJson(dayOf(siteId, TODAY), lead, body(new Mark(ali, "PRESENT", null)))).hasStatus(201)
            .bodyJson().extractingPath("$.recordedByName").isEqualTo("Yoklamacı Şef");
        assertThat(get(dayOf(UUID.randomUUID().toString(), TODAY), lead)).hasStatus(404);
    }
}
