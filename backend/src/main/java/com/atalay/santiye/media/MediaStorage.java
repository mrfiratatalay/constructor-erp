package com.atalay.santiye.media;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Medya dosyaları diskte, her medya kendi klasöründe: {firma}/{medya}/original, display.*, thumb.jpg.
 * Kullanıcının dosya adı hiçbir yolda kullanılmaz. Buluta geçerken yalnızca bu sınıf değişir.
 */
@Component
class MediaStorage {

    private static final String ORIGINAL = "original";
    private static final String THUMBNAIL = "thumb.jpg";

    private final Path root;

    MediaStorage(MediaProperties properties) {
        this.root = properties.root().toAbsolutePath().normalize();
    }

    void saveOriginal(Media media, MultipartFile file) throws IOException {
        Files.createDirectories(folderOf(media));
        file.transferTo(original(media));
    }

    Path original(Media media) {
        return folderOf(media).resolve(ORIGINAL);
    }

    Path display(Media media) {
        return folderOf(media).resolve(media.getKind().displayFile());
    }

    Path thumbnail(Media media) {
        return folderOf(media).resolve(THUMBNAIL);
    }

    Resource displayResource(Media media) {
        return new FileSystemResource(display(media));
    }

    Resource thumbnailResource(Media media) {
        return new FileSystemResource(thumbnail(media));
    }

    private Path folderOf(Media media) {
        return root.resolve(media.getCompanyId().toString()).resolve(media.getId().toString());
    }
}
