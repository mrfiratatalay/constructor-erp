package com.atalay.santiye.post;

import java.util.UUID;

/** Yeni gönderinin bilgileri; kimliği telefon üretir. */
record NewPost(UUID id, UUID companyId, UUID siteId, UUID authorId, String body, boolean issue) {
}
