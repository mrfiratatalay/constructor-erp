package com.atalay.santiye.media;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

/**
 * Yüklenen "video" aslında ağ adresleri içeren bir oynatma listesi (DASH) olabilir. ffmpeg onu açarken içindeki
 * adrese sunucunun adına bağlanmamalı (SSRF): test kendi dinleyicisini açar ve hiç bağlantı gelmediğini görür.
 */
@IntegrationTest
class MediaNetworkTest extends ApiTestSupport {

    @Test
    void anUploadedPlaylistCannotMakeTheServerCallOut() throws IOException {
        try (ServerSocket listener = new ServerSocket(0, 50, InetAddress.getLoopbackAddress())) {
            AtomicInteger calls = new AtomicInteger();
            Thread.ofVirtual().start(() -> countConnections(listener, calls));
            Cookie owner = loginAsOwner();
            PostDraft draft = PostDraft.to(createSite(owner, "Ağ Şantiyesi " + UUID.randomUUID()), null);
            Cookie lead = signedInLead(owner, "Liste Usta");
            byte[] manifest = dashManifest(listener.getLocalPort()).getBytes(StandardCharsets.UTF_8);

            assertThat(sendPost(lead, draft, new MockMultipartFile("files", "clip.mp4", "video/mp4", manifest)))
                .hasStatus(201);
            await().atMost(Duration.ofSeconds(60)).pollInterval(Duration.ofMillis(250))
                .until(() -> !"PROCESSING".equals(read(contentOf(get("/api/posts/" + draft.id(), lead)),
                    "$.media[0].status")));

            assertThat(calls.get()).isZero();
        }
    }

    private static void countConnections(ServerSocket listener, AtomicInteger calls) {
        while (!listener.isClosed()) {
            try (Socket ignored = listener.accept()) {
                calls.incrementAndGet();
            } catch (IOException closed) {
                return;
            }
        }
    }

    private static String dashManifest(int port) {
        return """
            <?xml version="1.0" encoding="UTF-8"?>
            <MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011"
                 type="static" mediaPresentationDuration="PT2S" minBufferTime="PT1S">
              <Period>
                <AdaptationSet mimeType="video/mp4">
                  <Representation id="1" bandwidth="1000" codecs="avc1.42E01E" width="16" height="16">
                    <BaseURL>http://127.0.0.1:%d/segment.mp4</BaseURL>
                  </Representation>
                </AdaptationSet>
              </Period>
            </MPD>
            """.formatted(port);
    }
}
