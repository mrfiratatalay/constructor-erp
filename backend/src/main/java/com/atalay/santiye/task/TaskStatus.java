package com.atalay.santiye.task;

/**
 * Görevin durumu. SUBMITTED: çalışan fotoğrafla teslim etti, şef ya da patron kontrol edecek (Kontrolde).
 * RETURNED: şef eksiğini gösterip geri gönderdi, çalışan tamamlayıp yeniden teslim eder (Eksik var).
 */
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    SUBMITTED,
    RETURNED,
    DONE
}
