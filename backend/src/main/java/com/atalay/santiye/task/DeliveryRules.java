package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.user.UserRole;
import java.util.Set;

/**
 * İş teslimi kuralları tek yerde: teslimi görevin sorumlusu yapar; açık, yapılıyor ya da eksiği dönmüş iş teslim
 * edilir. Teslimi şef ya da patron inceler, kimse kendi teslimini onaylamaz.
 */
final class DeliveryRules {

    private static final Set<TaskStatus> DELIVERABLE = Set.of(TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.RETURNED);

    private DeliveryRules() {
    }

    static boolean isDeliverable(TaskStatus status) {
        return DELIVERABLE.contains(status);
    }

    static boolean isReviewer(CurrentUser user) {
        return user.role() == UserRole.OWNER || user.role() == UserRole.SITE_LEAD;
    }

    static boolean canReview(CurrentUser user, TaskDelivery delivery) {
        return isReviewer(user) && delivery.isPending() && !delivery.getDeliveredBy().equals(user.userId());
    }
}
