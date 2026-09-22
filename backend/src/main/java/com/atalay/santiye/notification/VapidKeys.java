package com.atalay.santiye.notification;

import java.math.BigInteger;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.ECPrivateKey;
import java.security.interfaces.ECPublicKey;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Clock;
import java.util.Base64;
import org.springframework.stereotype.Component;

/**
 * Sunucunun Web Push kimliği (VAPID, P-256 eğrisi). İlk ihtiyaçta üretilir ve veritabanına yazılır;
 * sonraki açılışlarda aynısı okunur. Tarayıcıya açık anahtar "sıkıştırılmamış nokta" biçiminde verilir.
 */
@Component
class VapidKeys {

    private static final Base64.Encoder B64 = Base64.getUrlEncoder().withoutPadding();

    private final VapidKeyRepository repository;
    private final Clock clock;
    private volatile VapidKeyRecord cached;

    VapidKeys(VapidKeyRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    String publicKey() {
        return record().publicKey();
    }

    ECPrivateKey privateKey() {
        try {
            byte[] encoded = Base64.getDecoder().decode(record().privateKey());
            return (ECPrivateKey) KeyFactory.getInstance("EC").generatePrivate(new PKCS8EncodedKeySpec(encoded));
        } catch (GeneralSecurityException error) {
            throw new IllegalStateException("VAPID özel anahtarı okunamadı", error);
        }
    }

    private synchronized VapidKeyRecord record() {
        if (cached == null) {
            cached = repository.findById(VapidKeyRecord.SINGLETON_ID).orElseGet(() -> repository.save(generate()));
        }
        return cached;
    }

    private VapidKeyRecord generate() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
            generator.initialize(new ECGenParameterSpec("secp256r1"));
            KeyPair pair = generator.generateKeyPair();
            String publicKey = B64.encodeToString(uncompressedPoint((ECPublicKey) pair.getPublic()));
            String privateKey = Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded());
            return new VapidKeyRecord(publicKey, privateKey, clock.instant());
        } catch (GeneralSecurityException error) {
            throw new IllegalStateException("VAPID anahtarı üretilemedi", error);
        }
    }

    /** 0x04 || X (32 bayt) || Y (32 bayt): tarayıcının applicationServerKey olarak beklediği biçim. */
    private static byte[] uncompressedPoint(ECPublicKey key) {
        byte[] point = new byte[65];
        point[0] = 0x04;
        copyUnsigned(key.getW().getAffineX(), point, 1);
        copyUnsigned(key.getW().getAffineY(), point, 33);
        return point;
    }

    private static void copyUnsigned(BigInteger value, byte[] target, int offset) {
        byte[] bytes = value.toByteArray();
        int start = Math.max(0, bytes.length - 32);
        int length = bytes.length - start;
        System.arraycopy(bytes, start, target, offset + 32 - length, length);
    }
}
