package com.atalay.santiye.site;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "site_members")
class SiteMember {

    @EmbeddedId
    private SiteMemberId id;

    protected SiteMember() {
    }

    SiteMember(UUID siteId, UUID userId) {
        this.id = new SiteMemberId(siteId, userId);
    }

    UUID siteId() {
        return id.siteId();
    }

    UUID userId() {
        return id.userId();
    }
}
