package com.atalay.santiye.task;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.TestMedia;
import jakarta.servlet.http.Cookie;
import java.io.IOException;
import java.io.UncheckedIOException;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** İş teslimi testlerinde tekrar eden adımlar: çalışanın telefonu, görev açmak, fotoğrafla teslim etmek. */
abstract class DeliveryTestSupport extends ApiTestSupport {

    /** Firmanın bağlantısıyla katılan herkes çalışandır: "ustanın telefonu". */
    protected Cookie signedInWorker(Cookie owner, String fullName) {
        return sessionCookieOf(join(joinToken(owner), null, fullName, uniquePhone()));
    }

    protected String createTask(Cookie owner, String siteId, String title, String assigneeId) {
        String json = "{\"title\": \"%s\", \"assigneeId\": \"%s\", \"priority\": \"NORMAL\"}"
            .formatted(title, assigneeId);
        MvcTestResult result = postJson("/api/sites/" + siteId + "/tasks", owner, json);
        assertThat(result).hasStatus(201);
        return read(contentOf(result), "$.id");
    }

    /** Örnek fotoğraf, teslim ucunun beklediği adla ("photos"). */
    protected static MockMultipartFile photo() {
        try {
            return new MockMultipartFile("photos", "is.jpg", "image/jpeg", TestMedia.photo().getBytes());
        } catch (IOException error) {
            throw new UncheckedIOException(error);
        }
    }

    protected MvcTestResult deliver(Cookie session, String taskId, MockMultipartFile... photos) {
        var request = mvc.post().uri("/api/tasks/" + taskId + "/deliveries").multipart().cookie(session);
        for (MockMultipartFile photo : photos) {
            request.file(photo);
        }
        return request.exchange();
    }
}
