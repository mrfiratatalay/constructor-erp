package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.DeliveryPosts;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.task.dto.DeliveryMark;
import com.atalay.santiye.task.dto.TaskDeliveryView;
import com.atalay.santiye.task.dto.TaskPerson;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/** Teslimi sohbetteki kart için hazırlar: işin adı, şantiye, kişiler, fotoğraflar ve bakan kişinin yapabildikleri. */
@Component
class TaskDeliveryViews {

    private final TaskRepository tasks;
    private final TaskDeliveryRepository deliveries;
    private final SiteRepository sites;
    private final UserRepository users;
    private final DeliveryPosts messages;

    TaskDeliveryViews(TaskRepository tasks, TaskDeliveryRepository deliveries, SiteRepository sites,
        UserRepository users, DeliveryPosts messages) {
        this.tasks = tasks;
        this.deliveries = deliveries;
        this.sites = sites;
        this.users = users;
        this.messages = messages;
    }

    TaskDeliveryView of(CurrentUser viewer, TaskDelivery delivery) {
        Task task = tasks.findById(delivery.getTaskId()).orElseThrow();
        String siteName = sites.findById(task.getSiteId()).map(Site::getName).orElse("");
        Map<UUID, AppUser> people = users.findAllById(Stream.of(delivery.getDeliveredBy(), delivery.getReviewedBy())
                .filter(Objects::nonNull).toList()).stream()
            .collect(Collectors.toMap(AppUser::getId, Function.identity()));
        return new TaskDeliveryView(delivery.getId(), task.getId(), task.getTitle(), task.getStatus(), siteName,
            delivery.getStatus(), person(people, delivery.getDeliveredBy()), delivery.getDeliveredAt(),
            delivery.getPostId(), messages.photosOf(delivery.getPostId()), person(people, delivery.getReviewedBy()),
            delivery.getReviewedAt(), delivery.getMissingNote(), markOf(delivery),
            DeliveryRules.canReview(viewer, delivery), canRedeliver(viewer, task, delivery));
    }

    /** Yeniden teslim düğmesi yalnızca işin sorumlusunda, eksiği dönmüş işin en son teslim kartında durur. */
    private boolean canRedeliver(CurrentUser viewer, Task task, TaskDelivery delivery) {
        return task.isAssignedTo(viewer.userId()) && task.getStatus() == TaskStatus.RETURNED
            && deliveries.findFirstByTaskIdOrderByDeliveredAtDesc(task.getId())
                .map(latest -> latest.getId().equals(delivery.getId())).orElse(false);
    }

    private static DeliveryMark markOf(TaskDelivery delivery) {
        if (delivery.getMarkMediaId() == null) {
            return null;
        }
        return new DeliveryMark(delivery.getMarkMediaId(), delivery.getMarkX(), delivery.getMarkY());
    }

    private static TaskPerson person(Map<UUID, AppUser> people, UUID id) {
        AppUser user = id == null ? null : people.get(id);
        return user == null ? null : new TaskPerson(user.getId(), user.getFullName());
    }
}
