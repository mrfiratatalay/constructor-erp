package com.atalay.santiye.billing;

/** POS yok: para elden, havale/EFT ya da başka bir yolla alınır ve elle kaydedilir. */
public enum PaymentMethod {
    CASH,
    BANK_TRANSFER,
    OTHER
}
