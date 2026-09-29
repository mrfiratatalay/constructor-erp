package com.atalay.santiye.production;

import java.time.LocalDate;

/**
 * İmalatın durumu; girilmez, hesaplanır. COMPLETED: gerçekleşen toplama ulaştı. DELAYED: planlanan bitiş geçti, iş
 * bitmedi. NEARLY_DONE: %90 ve üstü. IN_PROGRESS: ötekiler. Gecikme bitmeye yakınlıktan önce gelir: %95'te olup
 * tarihi geçmiş iş gecikiyordur.
 */
public enum ProductionStatus {
    IN_PROGRESS,
    NEARLY_DONE,
    DELAYED,
    COMPLETED;

    private static final double NEARLY_DONE_PERCENT = 90;

    static ProductionStatus of(ProductionFigures figures, LocalDate plannedEnd, LocalDate today) {
        if (figures.isComplete()) {
            return COMPLETED;
        }
        if (plannedEnd != null && today.isAfter(plannedEnd)) {
            return DELAYED;
        }
        return figures.percent() >= NEARLY_DONE_PERCENT ? NEARLY_DONE : IN_PROGRESS;
    }
}
