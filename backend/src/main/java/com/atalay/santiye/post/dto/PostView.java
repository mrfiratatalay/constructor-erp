package com.atalay.santiye.post.dto;

import com.atalay.santiye.media.dto.MediaView;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * editedAt: düzeltildiyse ne zaman. deletion: silindiyse iz; yazı ve medya o zaman boştur.
 * replyTo: yanıtlanan mesajın alıntısı. forwarded: başka şantiyeden iletildi. pin: sabitlendiyse.
 * seenByAll: yazar dışındaki bütün katılımcılar gördü (WhatsApp'taki mavi ✓✓).
 */
public record PostView(
    UUID id,
    PostSiteRef site,
    PostAuthorRef author,
    @Nullable String body,
    boolean issue,
    Instant createdAt,
    List<MediaView> media,
    @Nullable IssueResolution resolution,
    @Nullable Instant editedAt,
    @Nullable PostDeletion deletion,
    @Nullable PostQuote replyTo,
    boolean forwarded,
    @Nullable PostPin pin,
    boolean seenByAll) {
}
