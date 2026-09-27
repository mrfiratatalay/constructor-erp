package com.atalay.santiye.rollcall;

import com.atalay.santiye.rollcall.dto.MemberCalendarDay;
import com.atalay.santiye.rollcall.dto.RollCallCounts;
import java.util.List;

/** Excel'de bir kişi: adı, ayın renklenen günleri ve ayın toplamları. */
record ExportRow(String fullName, List<MemberCalendarDay> days, RollCallCounts counts) {
}
