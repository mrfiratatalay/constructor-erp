package com.atalay.santiye.task;

/** Bir teslimin durumu: kontrol bekliyor, onaylandı ya da eksiğiyle geri gönderildi. */
public enum DeliveryStatus {
    PENDING,
    APPROVED,
    RETURNED
}
