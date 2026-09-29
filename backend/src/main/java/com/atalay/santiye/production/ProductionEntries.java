package com.atalay.santiye.production;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.MediaIntake;
import com.atalay.santiye.media.MediaOwner;
import com.atalay.santiye.post.FieldPosts;
import com.atalay.santiye.production.dto.ProductionEntryForm;
import com.atalay.santiye.production.dto.ProductionEntryView;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Günlük giriş: "bugün +3,5 ton" (yalnızca şef; controller denetler). Toplam, kalan ve yüzde girişlerden hesaplanır.
 * Şef isterse giriş Saha'ya da yazılır; dosyalar girişe (ve varsa Saha gönderisine) aynı işlemde bağlanır.
 */
@Service
public class ProductionEntries {

    private final ProductionEntryRepository entries;
    private final ProductionReads reads;
    private final FieldPosts fieldPosts;
    private final MediaIntake mediaIntake;
    private final Clock clock;

    ProductionEntries(ProductionEntryRepository entries, ProductionReads reads, FieldPosts fieldPosts,
        MediaIntake mediaIntake, Clock clock) {
        this.entries = entries;
        this.reads = reads;
        this.fieldPosts = fieldPosts;
        this.mediaIntake = mediaIntake;
        this.clock = clock;
    }

    /** Aynı kimlikle tekrar gelen istek (internet koptu, telefon yeniden denedi) ikinci giriş açmaz. */
    @Transactional
    public ProductionEntryView add(CurrentUser user, UUID itemId, ProductionEntryForm form) {
        Optional<ProductionEntry> existing = entries.findById(form.id());
        if (existing.isPresent()) {
            return reads.entryView(requireSame(existing.get(), user, itemId));
        }
        ProductionItem item = reads.require(user, itemId);
        if (form.day().isAfter(LocalDate.now(clock))) {
            throw ApiException.badRequest("İleri bir güne giriş yapılmaz.");
        }
        ProductionEntry entry = entries.save(new ProductionEntry(item, form, user.userId(), clock.instant()));
        UUID postId = form.onField() ? publish(user, item, entry) : null;
        entry.publishedAs(postId);
        List<MultipartFile> files = form.files() == null ? List.of() : form.files();
        if (!files.isEmpty()) {
            var owner = new MediaOwner(postId, item.getSiteId(), item.getCompanyId(), entry.getId());
            mediaIntake.acceptPhotosAndDocuments(owner, files);
        }
        return reads.entryView(entry);
    }

    /** Silinen giriş hesaptan düşer; Saha'ya yansıtıldıysa oradaki gönderi de geri çekilir. */
    @Transactional
    public void delete(CurrentUser user, UUID entryId) {
        ProductionEntry entry = entries.findByIdAndCompanyIdAndDeletedAtIsNull(entryId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Giriş bulunamadı."));
        entry.delete(clock.instant());
        if (entry.getPostId() != null) {
            fieldPosts.retract(user, entry.getPostId());
        }
    }

    /** Saha'ya yazılan, bu girişle birlikte ulaşılan toplamdır: "+3,5 ton · 62 / 120 ton (%51,7)". */
    private UUID publish(CurrentUser user, ProductionItem item, ProductionEntry entry) {
        ItemProgress progress = ItemProgress.of(
            entries.findByItemIdAndDeletedAtIsNullOrderByDayDescCreatedAtDesc(item.getId()), LocalDate.now(clock));
        var after = new ProductionFigures(item.getTotalQuantity(), progress.done());
        return fieldPosts.publish(user, item.getSiteId(), ProductionText.fieldBody(item, entry, after));
    }

    private static ProductionEntry requireSame(ProductionEntry entry, CurrentUser user, UUID itemId) {
        if (!entry.getItemId().equals(itemId) || !entry.getCreatedBy().equals(user.userId())) {
            throw ApiException.conflict("Bu giriş kimliği başka bir girişe ait.");
        }
        return entry;
    }
}
