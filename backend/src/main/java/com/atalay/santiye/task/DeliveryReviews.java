package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.post.DeliveryMessage;
import com.atalay.santiye.post.DeliveryPosts;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.task.dto.DeliveryMark;
import com.atalay.santiye.task.dto.ReturnDeliveryRequest;
import com.atalay.santiye.task.dto.TaskDeliveryView;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Teslimin incelenmesi: şef ya da patron fotoğraflara bakar, yalnızca iki şey der. Onayla: iş Tamamlandı, tarih,
 * teslim eden, onaylayan ve fotoğraflar saklanır. Eksik var: kısa not ve fotoğrafın üstünde nokta; iş çalışana
 * döner. İki cevap da sohbete teslim mesajının yanıtı olarak düşer: çalışan orada görür.
 */
@Service
public class DeliveryReviews {

    private final TaskRepository tasks;
    private final TaskDeliveryRepository deliveries;
    private final SiteAccess siteAccess;
    private final DeliveryPosts messages;
    private final TaskDeliveryViews views;
    private final Clock clock;

    DeliveryReviews(TaskRepository tasks, TaskDeliveryRepository deliveries, SiteAccess siteAccess,
        DeliveryPosts messages, TaskDeliveryViews views, Clock clock) {
        this.tasks = tasks;
        this.deliveries = deliveries;
        this.siteAccess = siteAccess;
        this.messages = messages;
        this.views = views;
        this.clock = clock;
    }

    /** İncelenen teslim ve görevi. */
    private record Review(TaskDelivery delivery, Task task) {
    }

    @Transactional
    public TaskDeliveryView approve(CurrentUser user, UUID deliveryId) {
        Review review = requireReviewable(user, deliveryId);
        review.delivery().approve(user.userId(), clock.instant());
        review.task().moveTo(TaskStatus.DONE, clock.instant());
        reply(user, review, "✅ Onaylandı: " + review.task().getTitle());
        return views.of(user, review.delivery());
    }

    @Transactional
    public TaskDeliveryView sendBack(CurrentUser user, UUID deliveryId, ReturnDeliveryRequest request) {
        Review review = requireReviewable(user, deliveryId);
        MissingWork missing = missingWork(review.delivery(), request);
        review.delivery().sendBack(user.userId(), clock.instant(), missing);
        review.task().moveTo(TaskStatus.RETURNED, clock.instant());
        reply(user, review, "❌ Eksik var: " + missing.note());
        return views.of(user, review.delivery());
    }

    private Review requireReviewable(CurrentUser user, UUID deliveryId) {
        TaskDelivery delivery = deliveries.findByIdAndCompanyId(deliveryId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Teslim bulunamadı."));
        Task task = tasks.findById(delivery.getTaskId()).orElseThrow();
        siteAccess.requireVisible(user, task.getSiteId());
        if (!DeliveryRules.isReviewer(user)) {
            throw ApiException.forbidden("Teslimi şef ya da patron inceler.");
        }
        if (delivery.getDeliveredBy().equals(user.userId())) {
            throw ApiException.forbidden("Kendi teslimini onaylayamazsın.");
        }
        if (!delivery.isPending()) {
            throw ApiException.conflict("Bu teslim zaten incelendi.");
        }
        return new Review(delivery, task);
    }

    /** Nokta varsa bu teslimin fotoğraflarından birinin üstündedir. */
    private MissingWork missingWork(TaskDelivery delivery, ReturnDeliveryRequest request) {
        DeliveryMark mark = request.mark();
        if (mark == null) {
            return new MissingWork(request.note().trim(), null, null, null);
        }
        boolean ownPhoto = messages.photosOf(delivery.getPostId()).stream()
            .map(MediaView::id)
            .anyMatch(mark.mediaId()::equals);
        if (!ownPhoto) {
            throw ApiException.badRequest("İşaretlenen fotoğraf bu teslimin değil.");
        }
        return new MissingWork(request.note().trim(), mark.mediaId(), mark.x(), mark.y());
    }

    private void reply(CurrentUser user, Review review, String body) {
        TaskDelivery delivery = review.delivery();
        messages.postReview(user,
            new DeliveryMessage(review.task().getSiteId(), delivery.getId(), body, delivery.getPostId()));
    }
}
