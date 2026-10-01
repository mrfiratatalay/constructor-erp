package com.atalay.santiye.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Başka bir kökenden gelen yazma isteğini (POST, PUT, PATCH, DELETE) reddeder. Oturum çerezi SameSite=Strict'tir ama
 * "site" alan adının kendisidir: aynı alan adının başka bir alt adresi (ör. ele geçirilmiş bir tanıtım sayfası) çerezi
 * taşıyan istek atabilir. JSON uçlarını tarayıcının CORS ön kontrolü durdurur; multipart yüklemeler (gönderi,
 * fotoğraf, logo, belge) ise ön kontrolsüz gider. Sec-Fetch-Site'ı tarayıcı yazar, sayfadaki betik değiştiremez.
 * Başlığı göndermeyen istemci (eski tarayıcı, curl, testler) geçer: onu SameSite çerezi korur. Arayüz ve API aynı
 * kökendedir (nginx, Vite vekili); API ayrı bir alt adrese taşınırsa burası CORS ile birlikte ele alınır.
 * Bilerek @Component değil: bean olsaydı Spring Boot onu servlet zincirine de ekler, iki kez çalışırdı.
 */
class CrossOriginWriteFilter extends OncePerRequestFilter {

    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS", "TRACE");
    /** same-origin: uygulamanın kendi sayfası; none: kullanıcının kendi açtığı adres (yer imi, adres çubuğu). */
    private static final Set<String> TRUSTED_SITES = Set.of("same-origin", "none");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        String site = request.getHeader("Sec-Fetch-Site");
        if (site != null && !SAFE_METHODS.contains(request.getMethod()) && !TRUSTED_SITES.contains(site)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Başka bir siteden gelen istek reddedildi.");
            return;
        }
        chain.doFilter(request, response);
    }
}
