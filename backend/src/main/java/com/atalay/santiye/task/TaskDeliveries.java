package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.DeliveryMessage;
import com.atalay.santiye.post.DeliveryPosts;
import com.atalay.santiye.post.TaskCards;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.task.dto.TaskDeliveryView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * İş teslimi (TASARIM.md "İş teslimi"): çalışan kendisine verilen görevi 1-4 fotoğrafla teslim eder; iş "Kontrolde"
 * olur ve sohbete fotoğraflı teslim mesajı düşer (görevin kartına yanıt olarak). Yeni bir iş sistemi değildir,
 * mevcut görevin bir adımıdır.
 */
@Service
public class TaskDeliveries {

    private static final int MAX_PHOTOS = 4;

    private final TaskRepository tasks;
    private final TaskDeliveryRepository deliveries;
    private final SiteAccess siteAccess;
    private final DeliveryPosts messages;
    private final TaskCards cards;
    private final TaskDeliveryViews views;
    private final Clock clock;

    TaskDeliveries(TaskRepository tasks, TaskDeliveryRepository deliveries, SiteAccess siteAccess,
        DeliveryPosts messages, TaskCards cards, TaskDeliveryViews views, Clock clock) {
        this.tasks = tasks;
        this.deliveries = deliveries;
        this.siteAccess = siteAccess;
        this.messages = messages;
        this.cards = cards;
        this.views = views;
        this.clock = clock;
    }

    @Transactional
    public TaskDeliveryView deliver(CurrentUser user, UUID taskId, List<MultipartFile> photos) {
        Task task = tasks.findByIdAndCompanyId(taskId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Görev bulunamadı."));
        Site site = siteAccess.requireVisible(user, task.getSiteId());
        requireDeliverable(user, task);
        requirePhotos(photos);
        UUID deliveryId = UUID.randomUUID();
        String body = "✅ İş teslim edildi: " + task.getTitle();
        UUID card = cards.cardOf(task.getId()).orElse(null);
        UUID postId = messages.postDelivery(user, new DeliveryMessage(site.getId(), deliveryId, body, card), photos);
        TaskDelivery delivery = deliveries.save(
            new TaskDelivery(deliveryId, task, postId, user.userId(), clock.instant()));
        task.moveTo(TaskStatus.SUBMITTED, clock.instant());
        return views.of(user, delivery);
    }

    @Transactional(readOnly = true)
    public TaskDeliveryView view(CurrentUser user, UUID deliveryId) {
        TaskDelivery delivery = deliveries.findByIdAndCompanyId(deliveryId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Teslim bulunamadı."));
        Task task = tasks.findById(delivery.getTaskId()).orElseThrow();
        siteAccess.requireVisible(user, task.getSiteId());
        return views.of(user, delivery);
    }

    private static void requireDeliverable(CurrentUser user, Task task) {
        if (!task.isAssignedTo(user.userId())) {
            throw ApiException.forbidden("Bu işi yalnızca işin sorumlusu teslim eder.");
        }
        if (task.getStatus() == TaskStatus.SUBMITTED) {
            throw ApiException.conflict("Bu iş zaten teslim edildi; şefin kontrolünü bekliyor.");
        }
        if (!DeliveryRules.isDeliverable(task.getStatus())) {
            throw ApiException.conflict("Bu iş tamamlandı.");
        }
    }

    /** İşin bittiğini fotoğraf gösterir: en az bir, en çok dört; yalnızca fotoğraf. */
    private static void requirePhotos(List<MultipartFile> photos) {
        if (photos == null || photos.isEmpty() || photos.size() > MAX_PHOTOS) {
            throw ApiException.badRequest("İşin 1-" + MAX_PHOTOS + " fotoğrafını ekle.");
        }
        boolean allPhotos = photos.stream()
            .allMatch(photo -> photo.getContentType() != null && photo.getContentType().startsWith("image/"));
        if (!allPhotos) {
            throw ApiException.badRequest("Teslimde yalnızca fotoğraf olur.");
        }
    }
}
