package com.atalay.santiye.notification;

/** url: bildirime dokununca açılacak uygulama adresi (ör. /santiyeler/...). Sınırları tabloyla aynı. */
public record NotificationContent(String title, String body, String url) {

    private static final int TITLE_LIMIT = 120;
    private static final int BODY_LIMIT = 300;

    public NotificationContent {
        title = cut(title, TITLE_LIMIT);
        body = cut(body, BODY_LIMIT);
    }

    private static String cut(String text, int limit) {
        return text.length() <= limit ? text : text.substring(0, limit - 1) + "…";
    }
}
