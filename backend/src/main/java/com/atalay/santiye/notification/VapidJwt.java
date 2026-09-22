package com.atalay.santiye.notification;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.Signature;
import java.security.interfaces.ECPrivateKey;
import java.time.Instant;
import java.util.Base64;

/** Push servisine "bu bildirimi gönderen benim" diyen imzalı kısa ömürlü belge (JWT, ES256). */
final class VapidJwt {

    private static final Base64.Encoder B64 = Base64.getUrlEncoder().withoutPadding();
    private static final String HEADER = "{\"typ\":\"JWT\",\"alg\":\"ES256\"}";

    private VapidJwt() {
    }

    static String sign(String audience, String subject, ECPrivateKey key, Instant expiresAt) {
        String claims = "{\"aud\":\"%s\",\"exp\":%d,\"sub\":\"%s\"}".formatted(audience, expiresAt.getEpochSecond(), subject);
        String unsigned = encode(HEADER) + "." + encode(claims);
        try {
            // P1363 biçimi: imza doğrudan R||S (64 bayt); JWT'nin beklediği biçim budur.
            Signature signer = Signature.getInstance("SHA256withECDSAinP1363Format");
            signer.initSign(key);
            signer.update(unsigned.getBytes(StandardCharsets.US_ASCII));
            return unsigned + "." + B64.encodeToString(signer.sign());
        } catch (GeneralSecurityException error) {
            throw new IllegalStateException("VAPID imzası atılamadı", error);
        }
    }

    private static String encode(String json) {
        return B64.encodeToString(json.getBytes(StandardCharsets.UTF_8));
    }
}
