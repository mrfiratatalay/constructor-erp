package com.atalay.santiye.common.web;

import jakarta.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HexFormat;
import java.util.regex.Pattern;

/**
 * İstemcinin adresi, sınırların (AttemptCounter) anahtarı olarak. Ters vekil arkasında gerçek adres Tomcat'in
 * X-Forwarded-For işlemesinden gelir (server.forward-headers-strategy). IPv6'da tek bir kullanıcının elinde koca bir
 * /64 bloğu olur: adres o bloğa indirgenir, yoksa her istekte yeni bir adres kullanıp sınır aşılabilirdi.
 */
public final class ClientAddress {

    private static final int IPV6_PREFIX_BYTES = 8;
    private static final int IPV6_BYTES = 16;
    /** Yalnızca IP yazımı çözülür: ad çözümlemesi (DNS) hiçbir zaman yapılmaz. */
    private static final Pattern IPV6_LITERAL = Pattern.compile("[0-9A-Fa-f:.]+(%[0-9A-Za-z_.-]+)?");

    private ClientAddress() {
    }

    public static String of(HttpServletRequest request) {
        return normalize(request.getRemoteAddr());
    }

    static String normalize(String address) {
        if (address == null || !address.contains(":") || !IPV6_LITERAL.matcher(address).matches()) {
            return String.valueOf(address);
        }
        try {
            byte[] bytes = InetAddress.getByName(address).getAddress();
            return bytes.length == IPV6_BYTES ? HexFormat.of().formatHex(bytes, 0, IPV6_PREFIX_BYTES) + "/64" : address;
        } catch (UnknownHostException invalid) {
            return address;
        }
    }
}
