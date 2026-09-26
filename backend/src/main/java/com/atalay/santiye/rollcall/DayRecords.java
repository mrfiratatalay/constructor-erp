package com.atalay.santiye.rollcall;

import com.atalay.santiye.rollcall.dto.DayRecord;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Kayıtları ekrana hazırlar. Şantiye ve işaretleyen adları kayıt başına değil toplu sorgulanır (N+1 olmaz). */
@Component
class DayRecords {

    private final SiteRepository sites;
    private final UserRepository users;

    DayRecords(SiteRepository sites, UserRepository users) {
        this.sites = sites;
        this.users = users;
    }

    Map<MemberDay, DayRecord> of(List<MemberAttendance> rows) {
        Map<UUID, String> siteNames = sites.findAllById(ids(rows, MemberAttendance::getSiteId)).stream()
            .collect(Collectors.toMap(Site::getId, Site::getName));
        Map<UUID, String> markers = users.findAllById(ids(rows, MemberAttendance::getMarkedBy)).stream()
            .collect(Collectors.toMap(AppUser::getId, AppUser::getFullName));
        return rows.stream().collect(Collectors.toMap(MemberAttendance::getId, row -> new DayRecord(row.getStatus(),
            row.getReason(), row.getCheckedInAt(), siteNames.get(row.getSiteId()), markers.get(row.getMarkedBy()),
            row.getMarkedAt())));
    }

    private static List<UUID> ids(List<MemberAttendance> rows, Function<MemberAttendance, UUID> id) {
        return rows.stream().map(id).filter(Objects::nonNull).distinct().toList();
    }
}
