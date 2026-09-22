package com.atalay.santiye.media;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * Silinen gönderinin medyası gerçekten gider: adresini bilen de açamaz, ana ekranın fotoğraf şeridine de
 * düşmez. Satırlar gönderinin silinmesiyle aynı işlemde, dosyalar işlem kesinleşince silinir: işlem geri
 * alınırsa dosyalar yerinde kalır.
 */
@Service
public class MediaRemoval {

    private static final Logger log = LoggerFactory.getLogger(MediaRemoval.class);

    private final MediaRepository media;
    private final MediaStorage storage;

    MediaRemoval(MediaRepository media, MediaStorage storage) {
        this.media = media;
        this.storage = storage;
    }

    @Transactional
    public void removeForPost(UUID postId) {
        List<Media> items = media.findByPostIdInOrderByPosition(List.of(postId));
        media.deleteAll(items);
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                items.forEach(MediaRemoval.this::deleteFiles);
            }
        });
    }

    /**
     * Silme kesinleşti; dosya silinemezse kullanıcıya hata dönmek yanlış olur, yalnızca kaydedilir.
     * O an işlenmekte olan bir video, işlem bitince klasörüne yazabilir; bu nadir artık diskte kalır.
     */
    private void deleteFiles(Media item) {
        try {
            storage.deleteFiles(item);
        } catch (IOException error) {
            log.warn("Silinen gönderinin dosyası silinemedi: {}", item.getId(), error);
        }
    }
}
