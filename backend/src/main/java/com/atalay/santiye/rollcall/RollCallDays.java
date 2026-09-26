package com.atalay.santiye.rollcall;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.rollcall.dto.DayRecord;
import com.atalay.santiye.rollcall.dto.MarkMemberRequest;
import com.atalay.santiye.rollcall.dto.MemberDayView;
import com.atalay.santiye.rollcall.dto.RollCallCounts;
import com.atalay.santiye.rollcall.dto.RollCallDayView;
import com.atalay.santiye.rollcall.dto.RollCallMember;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Patronun Yoklama ekranı: bir günün kişileri ve kaydı. Katılmayanı patron işaretler: Geldi, İzinli ya da
 * Gelmedi + neden. Geçmiş bir gün de işaretlenir (unutulan gün düzeltilir); ileri bir gün işaretlenmez.
 */
@Service
public class RollCallDays {

    private final MemberAttendanceRepository attendance;
    private final RollCallRoster roster;
    private final DayRecords records;
    private final UserRepository users;
    private final Clock clock;

    RollCallDays(MemberAttendanceRepository attendance, RollCallRoster roster, DayRecords records,
        UserRepository users, Clock clock) {
        this.attendance = attendance;
        this.roster = roster;
        this.records = records;
        this.users = users;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public RollCallDayView day(CurrentUser user, LocalDate day) {
        RollCallAccess.requireOwner(user);
        List<MemberAttendance> rows = attendance.findDay(user.companyId(), day);
        Map<MemberDay, DayRecord> byMember = records.of(rows);
        List<UUID> recorded = rows.stream().map(row -> row.getId().userId()).toList();
        List<MemberDayView> members = roster.on(user.companyId(), day, recorded).stream()
            .map(member -> new MemberDayView(new RollCallMember(member.getId(), member.getFullName()),
                byMember.get(new MemberDay(member.getId(), day))))
            .toList();
        return new RollCallDayView(day, countsOf(members), members);
    }

    @Transactional
    public RollCallDayView mark(CurrentUser user, LocalDate day, UUID memberId, MarkMemberRequest request) {
        RollCallAccess.requireOwner(user);
        if (day.isAfter(LocalDate.now(clock))) {
            throw ApiException.badRequest("İleri bir günün yoklaması işaretlenmez.");
        }
        AbsenceReason reason = reasonOf(request);
        requireInRoll(user, memberId);
        MemberDay id = new MemberDay(memberId, day);
        MemberAttendance row = attendance.findById(id).orElseGet(() -> new MemberAttendance(id, user.companyId()));
        row.mark(request.status(), reason, user.userId(), clock.instant());
        attendance.save(row);
        return day(user, day);
    }

    /** Gelmedi'nin nedeni zorunludur; Geldi ve İzinli neden taşımaz (gönderilse de yok sayılır). */
    private static AbsenceReason reasonOf(MarkMemberRequest request) {
        if (request.status() != AttendanceStatus.ABSENT) {
            return null;
        }
        if (request.reason() == null) {
            throw ApiException.badRequest("Gelmedi seçilince neden de seçilmeli: Hastalık, Habersiz ya da Diğer.");
        }
        return request.reason();
    }

    private void requireInRoll(CurrentUser user, UUID memberId) {
        AppUser member = users.findByIdAndCompanyId(memberId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Kişi bulunamadı."));
        if (member.getRole() == UserRole.OWNER) {
            throw ApiException.badRequest("Patron yoklamada sayılmaz.");
        }
    }

    private static RollCallCounts countsOf(List<MemberDayView> members) {
        return new RollCallCounts(
            count(members, AttendanceStatus.PRESENT),
            count(members, AttendanceStatus.ABSENT),
            count(members, AttendanceStatus.EXCUSED),
            members.stream().filter(member -> member.record() == null).count());
    }

    private static long count(List<MemberDayView> members, AttendanceStatus status) {
        return members.stream().filter(member -> member.record() != null && member.record().status() == status).count();
    }
}
