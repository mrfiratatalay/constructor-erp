package com.atalay.santiye.billing;

/** Çalışma alanının neden kapalı olduğu; arayüz kilit ekranında bu mesajı gösterir. Veri hiçbirinde silinmez. */
public enum LockReason {
    COMPANY_SUSPENDED("Firmanızın hesabı askıya alındı. Constructor ERP ile iletişime geçin."),
    COMPANY_ARCHIVED("Firmanızın hesabı arşivlendi. Constructor ERP ile iletişime geçin."),
    NO_SUBSCRIPTION("Firmanızın etkin bir aboneliği yok. Aboneliği başlatmak için Constructor ERP ile görüşün."),
    SUBSCRIPTION_NOT_STARTED("Aboneliğiniz henüz başlamadı."),
    SUBSCRIPTION_EXPIRED("Aboneliğinizin süresi doldu. Verileriniz duruyor; yenilendiğinde kaldığınız yerden devam edersiniz."),
    SUBSCRIPTION_SUSPENDED("Aboneliğiniz askıya alındı. Constructor ERP ile iletişime geçin."),
    SUBSCRIPTION_CANCELLED("Aboneliğiniz iptal edildi. Constructor ERP ile iletişime geçin.");

    private final String message;

    LockReason(String message) {
        this.message = message;
    }

    public String message() {
        return message;
    }
}
