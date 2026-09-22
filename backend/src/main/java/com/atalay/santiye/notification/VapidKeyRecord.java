package com.atalay.santiye.notification;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/** Tek satırlık tablo: sunucunun Web Push anahtar çifti. */
@Entity
@Table(name = "vapid_keys")
class VapidKeyRecord {

    static final int SINGLETON_ID = 1;

    @Id
    private Integer id;
    private String publicKey;
    private String privateKey;
    private Instant createdAt;

    protected VapidKeyRecord() {
    }

    VapidKeyRecord(String publicKey, String privateKey, Instant createdAt) {
        this.id = SINGLETON_ID;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.createdAt = createdAt;
    }

    String publicKey() {
        return publicKey;
    }

    String privateKey() {
        return privateKey;
    }
}
