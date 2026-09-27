package com.atalay.santiye.rollcall;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.rollcall.dto.MemberCalendarDay;
import com.atalay.santiye.user.AppUser;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.YearMonth;
import java.util.List;
import org.dhatim.fastexcel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yoklamanın aylık Excel dökümü: "Puantaj" (kişi × gün, renkli) ve "Kayıtlar" (gün gün tam liste). Kişinin
 * takvimiyle aynı günleri yazar (MemberMonths.calendar): ekranla dosya aynı şeyi söyler.
 */
@Service
public class RollCallExport {

    private final RollCallRoster roster;
    private final MemberMonths months;
    private final MemberAttendanceRepository attendance;
    private final Clock clock;

    RollCallExport(RollCallRoster roster, MemberMonths months, MemberAttendanceRepository attendance, Clock clock) {
        this.roster = roster;
        this.months = months;
        this.attendance = attendance;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public byte[] month(CurrentUser user, YearMonth month) {
        RollCallAccess.requireOwner(user);
        List<ExportRow> rows = rowsOf(user, month);
        ByteArrayOutputStream file = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(file, "Kizilkan Santiye", "1.0")) {
            PuantajSheet.write(workbook.newWorksheet("Puantaj"), month, rows);
            RecordsSheet.write(workbook.newWorksheet("Kayıtlar"), rows, clock.getZone());
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        return file.toByteArray();
    }

    /** Ayın herhangi bir gününde yoklamada olan herkes: ay sonunda firmada olanlar ve o ay kaydı olanlar. */
    private List<ExportRow> rowsOf(CurrentUser user, YearMonth month) {
        var recorded = attendance.findMembersBetween(user.companyId(), month.atDay(1), month.atEndOfMonth());
        return roster.on(user.companyId(), month.atEndOfMonth(), recorded).stream()
            .map(member -> rowOf(member, month))
            .toList();
    }

    private ExportRow rowOf(AppUser member, YearMonth month) {
        List<MemberCalendarDay> days = months.calendar(member, month);
        return new ExportRow(member.getFullName(), days,
            RollCallTally.of(days.stream().map(MemberCalendarDay::record).toList()));
    }
}
