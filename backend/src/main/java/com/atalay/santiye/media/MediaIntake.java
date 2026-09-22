package com.atalay.santiye.media;

import com.atalay.santiye.common.error.ApiException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Gönderiyle gelen dosyaları kabul eder; dönüşüm, gönderi kaydı kesinleşince arka planda başlar. */
@Service
public class MediaIntake {

    private static final int MAX_FILES = 10;

    private final MediaRepository media;
    private final MediaStorage storage;
    private final ApplicationEventPublisher events;
    private final Clock clock;

    MediaIntake(MediaRepository media, MediaStorage storage, ApplicationEventPublisher events, Clock clock) {
        this.media = media;
        this.storage = storage;
        this.events = events;
        this.clock = clock;
    }

    /** Gönderiyle aynı işlem içinde çağrılır: gönderi kaydedilemezse medya kaydı da geri alınır. */
    public void accept(MediaOwner owner, List<MultipartFile> files) {
        if (files.size() > MAX_FILES) {
            throw ApiException.badRequest("Bir gönderide en fazla " + MAX_FILES + " dosya olabilir.");
        }
        for (int position = 0; position < files.size(); position++) {
            store(owner, files.get(position), position);
        }
    }

    private void store(MediaOwner owner, MultipartFile file, int position) {
        MediaKind kind = MediaKind.fromContentType(file.getContentType())
            .orElseThrow(() -> ApiException.badRequest("Yalnızca fotoğraf, video ve ses gönderilebilir."));
        var upload = new Media.Upload(file.getContentType(), file.getSize(), clock.instant());
        Media item = media.save(new Media(owner, kind, position, upload));
        try {
            storage.saveOriginal(item, file);
        } catch (IOException error) {
            throw new UncheckedIOException("Dosya kaydedilemedi", error);
        }
        events.publishEvent(new MediaUploaded(item.getId()));
    }
}
