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
    private Instant editedAt;
    private Instant deletedAt;
    private UUID deletedBy;
    private UUID replyToId;
    private boolean forwarded;
    private Instant pinnedAt;
    private UUID pinnedBy;
    @Column(name = "is_field_update")
    private boolean fieldUpdate;
    private UUID deliveryId;

    protected Post() {
    }

    Post(NewPost post, Instant createdAt) {
        this.id = post.id();
        this.companyId = post.companyId();
        this.siteId = post.siteId();
        this.authorId = post.authorId();
        this.body = post.body();
        this.issue = post.issue();
        this.replyToId = post.replyToId();
        this.forwarded = post.forwarded();
        this.fieldUpdate = post.fieldUpdate();
        this.createdAt = createdAt;
    }

    /** İş teslimi ya da şefin cevabı: mesaj bir teslime bağlıdır, baloncukta kartı çizilir (DeliveryPosts). */
    static Post forDelivery(NewPost post, UUID deliveryId, Instant createdAt) {
        Post message = new Post(post, createdAt);
        message.deliveryId = deliveryId;
        return message;
    }

    /** Teslim ve cevabı işin kanıtıdır: silinmez, düzeltilmez, iletilmez. */
    boolean isDeliveryRecord() {
        return deliveryId != null;
    }

    public boolean isOpenIssue() {
        return issue && resolvedAt == null && deletedAt == null;
    }

    boolean isDeleted() {
        return deletedAt != null;
    }

    void resolve(UUID by, String note, Instant at) {
        this.resolvedAt = at;
        this.resolvedBy = by;
        this.resolutionNote = note;
    }

    void correct(String newBody, boolean newIssue, Instant at) {
        this.body = newBody;
        this.issue = newIssue;
        this.editedAt = at;
    }

    /**
     * Satır iz olarak kalır, yazı gider. "Sorun" işareti kalır: izde silinenin bir sorun olduğu görünür.
     * Silinen mesaj sabit kalmaz: şeritte içeriği olmayan bir iz durmaz.
     */
    void delete(UUID by, Instant at) {
        this.body = null;
        this.deletedAt = at;
        this.deletedBy = by;
        unpin();
    }

    void pin(UUID by, Instant at) {
        this.pinnedAt = at;
        this.pinnedBy = by;
    }

    void unpin() {
        this.pinnedAt = null;
        this.pinnedBy = null;
    }

    boolean isPinned() {
        return pinnedAt != null;
    }

    /** "Sahaya ekle" / "Sahadan çıkar": mesaj sohbette olduğu gibi kalır, yalnızca Saha'da görünüp görünmediği. */
    void markFieldUpdate(boolean onField) {
        this.fieldUpdate = onField;
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

    public Instant getEditedAt() {
        return editedAt;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public UUID getDeletedBy() {
        return deletedBy;
    }

    public UUID getReplyToId() {
        return replyToId;
    }

    public boolean isForwarded() {
        return forwarded;
    }

    public Instant getPinnedAt() {
        return pinnedAt;
    }

    public UUID getPinnedBy() {
        return pinnedBy;
    }

    public boolean isFieldUpdate() {
        return fieldUpdate;
    }

    public UUID getDeliveryId() {
        return deliveryId;
    }
}
