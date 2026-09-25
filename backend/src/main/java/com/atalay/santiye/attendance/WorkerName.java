package com.atalay.santiye.attendance;

/** Personelin elle girilen bilgileri; temizlenmiş hâliyle ("ALİ USTA" → "Ali Usta", boş görev → null). */
record WorkerName(String fullName, String trade) {
}
