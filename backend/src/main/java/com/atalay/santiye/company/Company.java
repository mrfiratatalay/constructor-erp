package com.atalay.santiye.company;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    private UUID id;
    private String name;
    private Instant createdAt;
    private String joinToken;

    protected Company() {
    }

    public Company(String name, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.createdAt = createdAt;
    }

    /** Firmaya katılma bağlantısının anahtarı; yenisi yazılınca eski bağlantı çalışmaz. */
    public void renewJoinToken(String token) {
        this.joinToken = token;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getJoinToken() {
        return joinToken;
    }
}
