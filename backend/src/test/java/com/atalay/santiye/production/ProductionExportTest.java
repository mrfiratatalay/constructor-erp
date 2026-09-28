package com.atalay.santiye.production;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipFile;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** İmalat raporu (Excel): imalatı gören herkes indirir; iki sayfada imalatlar ve günlük girişler. */
@IntegrationTest
class ProductionExportTest extends ProductionTestSupport {

    @Test
    void everyoneWhoSeesProductionDownloadsTheReport() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Rapor Şantiyesi");
        Cookie lead = signedInLead(owner, "Rapor Şefi");
        Cookie keeper = signedInStorekeeper(owner, "Rapor Depocusu");
        Cookie worker = sessionCookieOf(join(joinToken(owner), null, "Rapor Ustası", uniquePhone()));
        String itemId = itemOf(lead, siteId, "120", createCrew(lead, "Rapor Demir"));
        addEntry(lead, itemId, Entry.today("3.5"));
        String uri = "/api/sites/%s/production/export".formatted(siteId);

        MvcTestResult report = get(uri, owner);

        assertThat(report).hasStatus(200);
        assertThat(report.getResponse().getHeader("Content-Disposition")).contains("imalat-").contains(".xlsx");
        String texts = sharedStrings(report.getResponse().getContentAsByteArray());
        assertThat(texts).contains("Demir İşleri", "Rapor Demir", "Devam ediyor", "Rapor Şefi", "Günlük girişler");
        assertThat(get(uri, keeper)).hasStatus(200);
        assertThat(get(uri, worker)).hasStatus(403);
    }

    /**
     * xlsx bir zip'tir: hücre yazıları sharedStrings'te, sayfa adları workbook.xml'de durur. Excel gibi sondaki
     * dizinden okunur (ZipFile): fastexcel akışla yazar, parçaların boyutu yerel başlıkta değil dizindedir.
     */
    private static String sharedStrings(byte[] xlsx) {
        try {
            Path file = Files.createTempFile("imalat", ".xlsx");
            Files.write(file, xlsx);
            try (var zip = new ZipFile(file.toFile())) {
                return unescaped(read(zip, "xl/sharedStrings.xml") + read(zip, "xl/workbook.xml"));
            } finally {
                Files.delete(file);
            }
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
    }

    /** XML Türkçe harfleri kodla yazar ("İ" → &#x130;): karşılaştırmadan önce harfe çevrilir. */
    private static String unescaped(String xml) {
        return Pattern.compile("&#x([0-9a-fA-F]+);").matcher(xml).replaceAll(
            code -> Matcher.quoteReplacement(Character.toString(Integer.parseInt(code.group(1), 16))));
    }

    private static String read(ZipFile zip, String part) throws IOException {
        try (var stream = zip.getInputStream(zip.getEntry(part))) {
            return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
