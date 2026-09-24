package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceEntryRequest;
import com.atalay.santiye.common.error.ApiException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Gelen yoklama listesini kayda çevirir ve doğrular: herkes bu şantiyenin personeli mi, kimse iki kez
 * yazılmış mı, gelmeyenin nedeni seçilmiş mi. Neden yalnızca "Gelmedi"de tutulur; boş not yok sayılır.
 */
@Component
class AttendanceMarks {

    private final SiteWorkerRepository workers;

    AttendanceMarks(SiteWorkerRepository workers) {
        this.workers = workers;
    }

    List<AttendanceEntry> build(Attendance attendance, List<AttendanceEntryRequest> requests) {
        requireSiteWorkers(attendance.getSiteId(), requests);
        return requests.stream()
            .map(request -> new AttendanceEntry(new AttendanceEntryId(attendance.getId(), request.workerId()), mark(request)))
            .toList();
    }

    private void requireSiteWorkers(UUID siteId, List<AttendanceEntryRequest> requests) {
        Set<UUID> ids = requests.stream().map(AttendanceEntryRequest::workerId).collect(Collectors.toSet());
        if (ids.size() != requests.size()) {
            throw ApiException.badRequest("Bir personel yoklamada iki kez yazılamaz.");
        }
        long onSite = workers.findAllById(ids).stream().filter(worker -> worker.getSiteId().equals(siteId)).count();
        if (onSite != ids.size()) {
            throw ApiException.badRequest("Yoklamadaki personelden biri bu şantiyede değil.");
        }
    }

    private static EntryMark mark(AttendanceEntryRequest request) {
        boolean absent = request.status() == AttendanceStatus.ABSENT;
        if (absent && request.reason() == null) {
            throw ApiException.badRequest("Gelmeyen kişinin nedenini seç.");
        }
        String note = request.note() == null || request.note().isBlank() ? null : request.note().trim();
        return new EntryMark(request.status(), absent ? request.reason() : null, note);
    }
}
