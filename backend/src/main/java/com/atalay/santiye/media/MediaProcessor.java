package com.atalay.santiye.media;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/** Yüklenen dosyayı her cihazda oynayan biçime çevirir; sonucu READY ya da FAILED olarak yazar. */
@Component
class MediaProcessor {

    private static final Logger log = LoggerFactory.getLogger(MediaProcessor.class);

    private final MediaRepository media;
    private final MediaStorage storage;
    private final Ffmpeg ffmpeg;
    private final MediaProperties properties;
    private final MediaQueue queue;

    MediaProcessor(MediaRepository media, MediaStorage storage, Ffmpeg ffmpeg, MediaProperties properties,
        MediaQueue queue) {
        this.media = media;
        this.storage = storage;
        this.ffmpeg = ffmpeg;
        this.properties = properties;
        this.queue = queue;
    }

    /** Gönderinin kaydı kesinleştikten sonra: geri alınan bir gönderinin dosyası boşuna işlenmez. */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void onUploaded(MediaUploaded event) {
        enqueue(event.mediaId());
    }

    void enqueue(UUID mediaId) {
        queue.submit(() -> media.findById(mediaId)
            .filter(item -> item.getStatus() == MediaStatus.PROCESSING)
            .ifPresent(this::convert));
    }

    private void convert(Media item) {
        try {
            MediaFiles files = new MediaFiles(storage.original(item), storage.display(item), storage.thumbnail(item));
            for (List<String> command : FfmpegCommands.forMedia(item.getKind(), files, properties)) {
                ffmpeg.run(command);
            }
            Double duration = item.getKind().isTimed() ? ffmpeg.probeDuration(files.display()) : null;
            media.finish(item.getId(), MediaStatus.READY, duration);
        } catch (IOException | RuntimeException error) {
            log.warn("Medya işlenemedi: {}", item.getId(), error);
            media.finish(item.getId(), MediaStatus.FAILED, null);
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();
        }
    }
}
