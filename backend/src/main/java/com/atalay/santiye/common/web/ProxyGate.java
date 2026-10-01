package com.atalay.santiye.common.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Backend bir vekilin (Vercel) arkasındayken yalnızca vekilden gelen isteği kabul eder. Vekil her isteğe ikisinin
 * bildiği sırrı (X-Proxy-Secret) ekler; sırrı taşımayan istek, yani Render adresine doğrudan gelen, 404 alır. Kabul
 * edilen istekte kişinin adresi vekilin bildirdiğinden okunur: yoksa herkes vekilin birkaç adresinden geliyor görünür,
 * giriş ve başvuru sınırları (ClientAddress) bütün kullanıcıların paylaştığı tek bir kotaya dönerdi. Render'ın sağlık
 * yoklaması doğrudan gelir, ona açıktır. Sır verilmezse (Docker, VPS'te nginx) kapı kurulmaz (ProxyGateConfig).
 */
class ProxyGate extends OncePerRequestFilter {

    static final String SECRET_HEADER = "X-Proxy-Secret";
    private static final String HEALTH = "/actuator/health";

    private final byte[] secret;

    ProxyGate(String secret) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().equals(HEALTH);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        String given = request.getHeader(SECRET_HEADER);
        // Sabit sürede karşılaştırılır: yanıt süresinden sırrın baştan kaç harfinin doğru olduğu anlaşılmaz.
        if (given == null || !MessageDigest.isEqual(secret, given.getBytes(StandardCharsets.UTF_8))) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        chain.doFilter(new ProxiedRequest(request), response);
    }

    /** Kişinin adresi: Vercel'in yazdığı başlık; yoksa X-Forwarded-For'un ilk (vekilin yazdığı) değeri. */
    private static final class ProxiedRequest extends HttpServletRequestWrapper {

        ProxiedRequest(HttpServletRequest request) {
            super(request);
        }

        @Override
        public String getRemoteAddr() {
            String client = firstOf(getHeader("X-Vercel-Forwarded-For"));
            if (client == null) {
                client = firstOf(getHeader("X-Forwarded-For"));
            }
            return client == null ? super.getRemoteAddr() : client;
        }

        private static String firstOf(String header) {
            if (header == null || header.isBlank()) {
                return null;
            }
            return header.split(",", 2)[0].strip();
        }
    }
}
