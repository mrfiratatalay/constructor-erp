package com.atalay.santiye.media;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** İlet: bir gönderinin hazır dosyaları başka bir gönderiye kopyalanır (WhatsApp'ta iletilen fotoğraf gibi). */
@Service
public class MediaCopies {

    private final MediaRepository media;
    private final MediaStorage storage;
    private final Clock clock;

    MediaCopies(MediaRepository media, MediaStorage storage, Clock clock) {
        this.media = media;
        this.storage = storage;
        this.clock = clock;
    }

    /** Henüz işlenmekte olan ya da işlenemeyen dosya iletilmez; yalnızca hazır olanlar kopyalanır. */
    @Transactional
    public int copyPostMedia(UUID sourcePostId, MediaOwner target) {
        List<Media> ready = media.findByPostIdInOrderByPosition(List.of(sourcePostId)).stream()
            .filter(item -> item.getStatus() == MediaStatus.READY)
            .toList();
        for (Media source : ready) {
            Media copy = media.save(new Media(target, source, clock.instant()));
            try {
                storage.copyFiles(source, copy);
            } catch (IOException error) {
                throw new UncheckedIOException("İletilen dosya kopyalanamadı", error);
            }
        }
        return ready.size();
    }
}
