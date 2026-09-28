package com.atalay.santiye.material;

/** Yüklenen belgenin güvenli adı ve türü; kullanıcının dosya adı hiçbir disk yolunda kullanılmaz. */
record DocumentFile(String fileName, String contentType, long sizeBytes) {
}
