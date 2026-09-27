package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.RollCallPosts;
import com.atalay.santiye.rollcall.dto.DayRecord;
import com.atalay.santiye.rollcall.dto.MemberCalendarDay;
import com.atalay.santiye.rollcall.dto.MemberMonthView;
import com.atalay.santiye.rollcall.dto.RollCallMember;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kişinin takvimi: geldiği günler yeşil, gelmediği kırmızı, izinli sarı, katılmadığı gri. "Katılmadı" yazılmaz,
 * hesaplanır: geçmiş bir günde firmada yoklama mesajı var, kişi o gün firmadaydı ama kaydı yok.
 */
@Service
public class MemberMonths {

    private final MemberAttendanceRepository attendance;
    private final RollCallPosts rollCallPosts;
    private final DayRecords records;
    private final RollCallRoster roster;
    private final UserRepository users;
    private final Clock clock;

    MemberMonths(MemberAttendanceRepository attendance, RollCallPosts rollCallPosts, DayRecords records,
        RollCallRoster roster, UserRepository users, Clock clock) {
        this.attendance = attendance;
        this.rollCallPosts = rollCallPosts;
        this.records = records;
        this.roster = roster;
        this.users = users;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public MemberMonthView month(CurrentUser user, UUID memberId, YearMonth month) {
        RollCallAccess.requireOwner(user);
        AppUser member = requireMember(user, memberId);
        List<MemberCalendarDay> days = calendar(member, month);
        List<DayRecord> dayRecords = days.stream().map(MemberCalendarDay::record).toList();
        return new MemberMonthView(new RollCallMember(member.getId(), member.getFullName()), month.toString(),
            RollCallTally.of(dayRecords), days);
    }

    /** Kaydı olan günler ve katılmadığı günler, eskiden yeniye. */
    List<MemberCalendarDay> calendar(AppUser member, YearMonth month) {
        LocalDate from = month.atDay(1);
        LocalDate to = month.atEndOfMonth();
        Map<LocalDate, DayRecord> recorded = records.of(attendance.findMemberBetween(member.getId(), from, to))
            .entrySet().stream().collect(Collectors.toMap(entry -> entry.getKey().day(), Map.Entry::getValue));
        Stream<MemberCalendarDay> missed = rollCallPosts.rollCallDays(member.getCompanyId(), from, to).stream()
            .filter(day -> isMissed(day, member, recorded))
            .map(day -> new MemberCalendarDay(day, null));
        Stream<MemberCalendarDay> kept = recorded.entrySet().stream()
            .map(entry -> new MemberCalendarDay(entry.getKey(), entry.getValue()));
        return Stream.concat(kept, missed).sorted(Comparator.comparing(MemberCalendarDay::day)).toList();
    }

    /** Bugün henüz "katılmadı" sayılmaz (gün bitmedi); kişinin firmaya katılmasından önceki gün de sayılmaz. */
    private boolean isMissed(LocalDate day, AppUser member, Map<LocalDate, DayRecord> recorded) {
        return !recorded.containsKey(day)
            && day.isBefore(LocalDate.now(clock))
            && !day.isBefore(roster.joinedOn(member));
    }

    private AppUser requireMember(CurrentUser user, UUID memberId) {
        AppUser member = users.findByIdAndCompanyId(memberId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Kişi bulunamadı."));
        if (member.getRole() == UserRole.OWNER) {
            throw ApiException.badRequest("Patron yoklamada sayılmaz.");
        }
        return member;
    }
}
