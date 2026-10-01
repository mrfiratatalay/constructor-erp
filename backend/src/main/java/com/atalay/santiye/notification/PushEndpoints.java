package com.atalay.santiye.notification;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Bildirim gönderilebilecek adresler: yalnızca tarayıcıların push servisleri. Sunucu kayıtlı her adrese kendisi
 * istek attığı için (WebPushSender) istemcinin verdiği adrese güvenilmez; yoksa sunucuya iç ağdaki bir servise ya da
 * herhangi bir adrese istek attırılabilirdi (SSRF).
 */
final class PushEndpoints {

    /** Chrome, Android, Samsung, Opera (Firebase). */
    private static final Set<String> HOSTS = Set.of("fcm.googleapis.com", "android.googleapis.com");
    /** Firefox (Mozilla), Safari (Apple), Edge ve Windows (WNS): servis adresi alt alan adıyla gelir. */
    private static final List<String> DOMAINS = List.of(".push.services.mozilla.com", ".push.apple.com",
        ".notify.windows.com");
    private static final int HTTPS_PORT = 443;

    private PushEndpoints() {
    }

    static boolean isAllowed(String endpoint) {
        try {
            URI uri = new URI(endpoint);
            boolean secure = "https".equalsIgnoreCase(uri.getScheme()) && uri.getRawUserInfo() == null;
            boolean standardPort = uri.getPort() == -1 || uri.getPort() == HTTPS_PORT;
            return secure && standardPort && uri.getHost() != null && isPushService(uri.getHost());
        } catch (URISyntaxException invalid) {
            return false;
        }
    }

    private static boolean isPushService(String host) {
        String name = host.toLowerCase(Locale.ROOT);
        return HOSTS.contains(name) || DOMAINS.stream().anyMatch(name::endsWith);
    }
}
