package com.atalay.santiye.post;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID siteId;
    private UUID authorId;
    private String body;
    @Column(name = "is_issue")
    private boolean issue;
    private Instant createdAt;
    private Instant resolvedAt;
    private UUID resolvedBy;
    private String resolutionNote;

    protected Post() {
    }

    Post(NewPost post, Instant createdAt) {
        this.id = post.id();
        this.companyId = post.companyId();
        this.siteId = post.siteId();
        this.authorId = post.authorId();
        this.body = post.body();
        this.issue = post.issue();
        this.createdAt = createdAt;
    }

    public boolean isOpenIssue() {
        return issue && resolvedAt == null;
    }

    void resolve(UUID by, String note, Instant at) {
        this.resolvedAt = at;
        this.resolvedBy = by;
        this.resolutionNote = note;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public UUID getSiteId() {
        return siteId;
    }

    public UUID getAuthorId() {
        return authorId;
    }

    public String getBody() {
        return body;
    }

    public boolean isIssue() {
        return issue;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public UUID getResolvedBy() {
        return resolvedBy;
    }

    public String getResolutionNote() {
        return resolutionNote;
    }
}
