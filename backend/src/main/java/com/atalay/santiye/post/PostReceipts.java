package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.visit.SeenReceipts;
import com.atalay.santiye.visit.dto.SeenBy;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mesaj bilgisi (WhatsApp'ta "Bilgi"): yazar dışındaki katılımcılar ve mesajı ne zaman gördükleri.
 * Şantiyeye mesajdan önce bakmış olan henüz görmemiştir; onun satırında zaman boş gelir.
 */
@Service
public class PostReceipts {

    private final VisiblePosts visible;
    private final SeenReceipts receipts;

    PostReceipts(VisiblePosts visible, SeenReceipts receipts) {
        this.visible = visible;
        this.receipts = receipts;
    }

    @Transactional(readOnly = true)
    public List<SeenBy> receipts(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        List<SeenBy> participants = receipts.participantsBySite(post.getCompanyId(), List.of(post.getSiteId()))
            .getOrDefault(post.getSiteId(), List.of());
        return participants.stream()
            .filter(seen -> !seen.userId().equals(post.getAuthorId()))
            .map(seen -> seenAfter(seen, post))
            .toList();
    }

    private static SeenBy seenAfter(SeenBy seen, Post post) {
        boolean saw = seen.seenAt() != null && !seen.seenAt().isBefore(post.getCreatedAt());
        return new SeenBy(seen.userId(), seen.fullName(), saw ? seen.seenAt() : null);
    }
}
