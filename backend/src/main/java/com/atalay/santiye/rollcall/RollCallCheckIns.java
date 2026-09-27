package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.RollCallMessage;
import com.atalay.santiye.post.RollCallPosts;
import com.atalay.santiye.rollcall.dto.MyRollCall;
import com.atalay.santiye.rollcall.dto.RollCallView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * "Yoklamaya Katıl": çalışan sohbetteki yoklama mesajına kendi telefonundan basar ve o gün geldi sayılır.
 * Yalnızca bugünün mesajına katılınır; dünkü mesaj kapanmıştır (bugün basılsa yanlış güne geldi yazılırdı).
 * Patron yoklamada sayılmaz: kimin geldiğini Yoklama modülünden görür.
 */
@Service
public class RollCallCheckIns {

    private final RollCallPosts rollCallPosts;
    private final MemberAttendanceRepository attendance;
    private final SiteRepository sites;
    private final Clock clock;

    RollCallCheckIns(RollCallPosts rollCallPosts, MemberAttendanceRepository attendance, SiteRepository sites,
        Clock clock) {
        this.rollCallPosts = rollCallPosts;
        this.attendance = attendance;
        this.sites = sites;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public RollCallView view(CurrentUser user, UUID postId) {
        return viewOf(user, rollCallPosts.require(user, postId));
    }

    @Transactional
    public RollCallView checkIn(CurrentUser user, UUID postId) {
        RollCallMessage message = rollCallPosts.require(user, postId);
        if (user.isOwner()) {
            throw ApiException.forbidden("Patron yoklamada sayılmaz; kimin geldiğini Yoklama'dan görürsün.");
        }
        if (!message.day().equals(LocalDate.now(clock))) {
            throw ApiException.conflict("Bu yoklama kapandı: yalnızca bugünün yoklamasına katılınır.");
        }
        MemberDay id = new MemberDay(user.userId(), message.day());
        MemberAttendance day = attendance.findById(id).orElseGet(() -> new MemberAttendance(id, user.companyId()));
        day.checkIn(message.siteId(), clock.instant());
        attendance.save(day);
        return viewOf(user, message);
    }

    private RollCallView viewOf(CurrentUser user, RollCallMessage message) {
        boolean open = message.day().equals(LocalDate.now(clock));
        long joined = attendance.countCheckedIn(message.siteId(), message.day());
        return new RollCallView(message.day(), open, joined, user.isOwner() ? null : mine(user, message.day()));
    }

    private MyRollCall mine(CurrentUser user, LocalDate day) {
        return attendance.findById(new MemberDay(user.userId(), day))
            .map(found -> new MyRollCall(found.getStatus(), found.getCheckedInAt(), siteName(found.getSiteId())))
            .orElse(null);
    }

    private String siteName(UUID siteId) {
        return siteId == null ? null : sites.findById(siteId).map(Site::getName).orElse(null);
    }
}
