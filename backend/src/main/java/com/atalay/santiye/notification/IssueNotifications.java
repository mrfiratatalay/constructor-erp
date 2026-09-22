package com.atalay.santiye.notification;

import com.atalay.santiye.post.IssueReported;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.util.List;
import java.util.UUID;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/** Sahadan sorun gelince patronlar hemen haberdar olur; sorunu kendisi yazdıysa kendine bildirim gitmez. */
@Component
class IssueNotifications {

    private static final int EXCERPT = 120;

    private final UserRepository users;
    private final Notifier notifier;

    IssueNotifications(UserRepository users, Notifier notifier) {
        this.users = users;
        this.notifier = notifier;
    }

    /** Kayıt kesinleştikten sonra ve arka planda: formen bildirimlerin gitmesini beklemez. */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void onIssueReported(IssueReported issue) {
        List<UUID> owners = users.findByCompanyIdAndRoleAndActiveTrue(issue.companyId(), UserRole.OWNER).stream()
            .map(AppUser::getId)
            .filter(ownerId -> !ownerId.equals(issue.authorId()))
            .toList();
        notifier.deliver(owners, new NotificationContent(
            "Yeni sorun · " + issue.siteName(), describe(issue), "/santiyeler/" + issue.siteId()));
    }

    private static String describe(IssueReported issue) {
        if (issue.body() == null) {
            return issue.authorName() + " fotoğraflı bir sorun bildirdi.";
        }
        String text = issue.body().length() > EXCERPT ? issue.body().substring(0, EXCERPT) + "…" : issue.body();
        return issue.authorName() + ": " + text;
    }
}
