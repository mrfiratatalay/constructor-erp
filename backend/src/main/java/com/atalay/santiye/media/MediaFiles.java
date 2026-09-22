package com.atalay.santiye.media;

import java.nio.file.Path;

/** Bir medyanın diskteki dosyaları: gelen asıl dosya, oynatılacak biçim ve önizleme. */
record MediaFiles(Path original, Path display, Path thumbnail) {
}
