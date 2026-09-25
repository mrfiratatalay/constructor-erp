package com.atalay.santiye.attendance;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
record AttendanceEntryId(UUID attendanceId, UUID workerId) implements Serializable {
}
