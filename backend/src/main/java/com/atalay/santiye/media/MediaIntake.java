package com.atalay.santiye.media;

import com.atalay.santiye.common.error.ApiException;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Gönderiyle gelen dosyaları kabul eder; dönüşüm, gönderi kaydı kesinleşince arka planda başlar. */
@Service
public class MediaIntake {

    private static final int MAX_FILES = 10;
    private static final int MAX_FILE_NAME = 200;

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
            store(owner, files.get(position), position, kindOf(files.get(position)));
        }
    }

    /** İmalat girişi yalnızca fotoğraf ve belge (PDF) alır: sahadan kanıt, video ya da ses değil. */
    public void acceptPhotosAndDocuments(MediaOwner owner, List<MultipartFile> files) {
        for (MultipartFile file : files) {
            MediaKind kind = kindOf(file);
            if (kind != MediaKind.PHOTO && kind != MediaKind.DOCUMENT) {
                throw ApiException.badRequest("Yalnızca fotoğraf ve PDF eklenebilir.");
            }
        }
        accept(owner, files);
    }

    /** Şantiyenin fotoğrafı (grup fotoğrafı): gönderiye bağlı değildir ve yalnızca fotoğraf olabilir. */
    UUID acceptSitePhoto(UUID siteId, UUID companyId, MultipartFile file) {
        if (kindOf(file) != MediaKind.PHOTO) {
            throw ApiException.badRequest("Şantiye fotoğrafı yalnızca fotoğraf olabilir.");
        }
        return store(new MediaOwner(null, siteId, companyId), file, 0, MediaKind.PHOTO).getId();
    }

    private static MediaKind kindOf(MultipartFile file) {
        return MediaKind.fromContentType(file.getContentType())
            .orElseThrow(() -> ApiException.badRequest("Yalnızca fotoğraf, video, ses ve PDF gönderilebilir."));
    }

    private Media store(MediaOwner owner, MultipartFile file, int position, MediaKind kind) {
        var upload = new Media.Upload(file.getContentType(), file.getSize(), displayName(file), clock.instant());
        Media item = media.save(new Media(owner, kind, position, upload));
        try {
            storage.saveOriginal(item, file);
        } catch (IOException error) {
            throw new UncheckedIOException("Dosya kaydedilemedi", error);
        }
        events.publishEvent(new MediaUploaded(item.getId()));
        return item;
    }

    /** Ad yalnızca ekranda gösterilir; klasör yolu içeremesin diye yalnızca son parçası alınır. */
    private static String displayName(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null || name.isBlank()) {
            return null;
        }
        String last = name.substring(Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\')) + 1).trim();
        return last.length() > MAX_FILE_NAME ? last.substring(last.length() - MAX_FILE_NAME) : last;
    }
}
