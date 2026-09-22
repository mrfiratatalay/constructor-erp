package com.atalay.santiye.media;

import java.util.Arrays;
import java.util.Optional;

/** Her tür, her cihazın oynatabildiği tek bir biçime çevrilir. */
public enum MediaKind {
    PHOTO("image/", "display.jpg", "image/jpeg"),
    VIDEO("video/", "display.mp4", "video/mp4"),
    AUDIO("audio/", "display.m4a", "audio/mp4");

    private final String uploadTypePrefix;
    private final String displayFile;
    private final String displayContentType;

    MediaKind(String uploadTypePrefix, String displayFile, String displayContentType) {
        this.uploadTypePrefix = uploadTypePrefix;
        this.displayFile = displayFile;
        this.displayContentType = displayContentType;
    }

    static Optional<MediaKind> fromContentType(String contentType) {
        return Arrays.stream(values())
            .filter(kind -> contentType != null && contentType.startsWith(kind.uploadTypePrefix))
            .findFirst();
    }

    String displayFile() {
        return displayFile;
    }

    String displayContentType() {
        return displayContentType;
    }

    /** Ses dışındakilerin küçük önizleme görseli olur (videoda ilk kareler). */
    boolean hasThumbnail() {
        return this != AUDIO;
    }

    boolean isTimed() {
        return this != PHOTO;
    }
}
