package com.atalay.santiye.support;

import java.util.UUID;

/** Testte gönderilecek gönderi. Kimlik telefondaki gibi istemcide üretilir. */
public record PostDraft(String siteId, String id, String body) {

    public static PostDraft to(String siteId, String body) {
        return new PostDraft(siteId, UUID.randomUUID().toString(), body);
    }

    public PostDraft withId(String postId) {
        return new PostDraft(siteId, postId, body);
    }
}
