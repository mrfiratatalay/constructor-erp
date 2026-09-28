package com.atalay.santiye.task;

import java.util.UUID;

/** Şefin "eksik var" dediği şey: kısa not ve (varsa) fotoğrafın üstündeki nokta. Nokta yoksa üçü de boştur. */
record MissingWork(String note, UUID mediaId, Float x, Float y) {
}
