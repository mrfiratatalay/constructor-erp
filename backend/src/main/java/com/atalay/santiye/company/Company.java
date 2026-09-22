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

    protected Company() {
    }

    public Company(String name, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
