package com.atalay.santiye.rollcall;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Collections;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class RollCallExportTest extends ApiTestSupport {

    /** Uygulamanın "bugün"ü şantiyenin saatine göredir (app.timezone). */
    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));
    private static final YearMonth THIS_MONTH = YearMonth.from(TODAY);

    /**
     * .xlsx bir zip arşividir: içindeki XML'lerin hepsi tek metin olarak okunur. Excel gibi arşivin sonundaki
     * içindekiler tablosundan okunur (ZipFile); akışla okuyan ZipInputStream, boyutu sonradan yazılan girdileri
     * (fastexcel böyle yazar) okuyamaz.
     */
    private static String xmlInside(byte[] xlsx) throws IOException {
        Path file = Files.createTempFile("yoklama", ".xlsx");
        Files.write(file, xlsx);
        StringBuilder xml = new StringBuilder();
        try (ZipFile zip = new ZipFile(file.toFile())) {
            for (ZipEntry entry : Collections.list(zip.entries())) {
                xml.append(new String(zip.getInputStream(entry).readAllBytes(), StandardCharsets.UTF_8));
            }
        } finally {
            Files.delete(file);
        }
        return decodeCharacterReferences(xml.toString());
    }

    /** fastexcel Türkçe harfleri XML'de karakter koduyla yazar ("Kay&#x131;tlar"); Excel onları harf olarak gösterir. */
    private static String decodeCharacterReferences(String xml) {
        return Pattern.compile("&#x([0-9a-fA-F]+);").matcher(xml)
            .replaceAll(code -> Matcher.quoteReplacement(Character.toString(Integer.parseInt(code.group(1), 16))));
    }

    @Test
    void theOwnerDownloadsTheMonthAsAnExcelFile() throws IOException {
        Cookie owner = loginAsOwner();
        String memberId = userIdOf(signedInLead(owner, "Puantaj Ustası"));
        putJson("/api/roll-calls/days/%s/members/%s".formatted(TODAY, memberId), owner,
            "{\"status\": \"ABSENT\", \"reason\": \"SICK\"}");

        MvcTestResult result = get("/api/roll-calls/export?month=" + THIS_MONTH, owner);

        assertThat(result).hasStatusOk().hasContentType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        assertThat(result.getResponse().getHeader("Content-Disposition"))
            .contains("yoklama-" + THIS_MONTH + ".xlsx");
        String xml = xmlInside(result.getResponse().getContentAsByteArray());
        assertThat(xml).contains("Puantaj", "Kayıtlar", "Puantaj Ustası", "Hastalık");
    }

    @Test
    void onlyTheOwnerDownloadsTheRoll() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Excel İsteyen");

        assertThat(get("/api/roll-calls/export?month=" + THIS_MONTH, lead)).hasStatus(403);
    }
}
