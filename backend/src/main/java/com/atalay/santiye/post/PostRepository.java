package com.atalay.santiye.post;

import com.atalay.santiye.common.persistence.SiteCount;
import com.atalay.santiye.common.persistence.SiteMoment;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Silinen gönderi akışta iz olarak görünür (ilk iki sorgu); sayımlara, sorunlara, önizlemeye ve
 * "son haber"e girmez: silinmiş bir gönderi haber değildir.
 */
interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("select p from Post p where p.siteId in :siteIds order by p.createdAt desc, p.id desc")
    List<Post> findNewest(Collection<UUID> siteIds, Pageable page);

    /** İmleçten (zaman, kimlik) daha eskiler: aynı saniyedeki gönderiler kimlikle ayrışır, hiçbiri atlanmaz. */
    @Query("""
        select p from Post p where p.siteId in :siteIds
        and (p.createdAt < :createdAt or (p.createdAt = :createdAt and p.id < :id))
        order by p.createdAt desc, p.id desc""")
    List<Post> findOlderThan(Collection<UUID> siteIds, Instant createdAt, UUID id, Pageable page);

    /** Saha akışı: şantiyenin saha güncellemeleri, en yeniden eskiye; silinenler iz olarak yerinde. */
    @Query("select p from Post p where p.siteId = :siteId and p.fieldUpdate = true "
        + "order by p.createdAt desc, p.id desc")
    List<Post> findNewestFieldUpdates(UUID siteId, Pageable page);

    @Query("""
        select p from Post p where p.siteId = :siteId and p.fieldUpdate = true
        and (p.createdAt < :createdAt or (p.createdAt = :createdAt and p.id < :id))
        order by p.createdAt desc, p.id desc""")
    List<Post> findFieldUpdatesOlderThan(UUID siteId, Instant createdAt, UUID id, Pageable page);

    /** En eski en üstte: en uzun bekleyen sorun en çok dikkat ister. */
    @Query("select p from Post p where p.siteId in :siteIds and p.issue = true and p.resolvedAt is null "
        + "and p.deletedAt is null order by p.createdAt asc")
    List<Post> findOpenIssues(Collection<UUID> siteIds);

    @Query("select p from Post p where p.siteId in :siteIds and p.issue = true and p.resolvedAt is not null "
        + "and p.deletedAt is null order by p.resolvedAt desc")
    List<Post> findResolvedIssues(Collection<UUID> siteIds, Pageable page);

    @Query("select new com.atalay.santiye.common.persistence.SiteMoment(p.siteId, max(p.createdAt)) "
        + "from Post p where p.siteId in :siteIds and p.deletedAt is null group by p.siteId")
    List<SiteMoment> findLastPostAt(Collection<UUID> siteIds);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(p.siteId, count(p)) from Post p "
        + "where p.siteId in :siteIds and p.createdAt >= :since and p.deletedAt is null group by p.siteId")
    List<SiteCount> countPostsSince(Collection<UUID> siteIds, Instant since);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(p.siteId, count(p)) from Post p "
        + "where p.siteId in :siteIds and p.issue = true and p.resolvedAt is null and p.deletedAt is null "
        + "group by p.siteId")
    List<SiteCount> countOpenIssues(Collection<UUID> siteIds);

    @Query("select new com.atalay.santiye.common.persistence.SiteMoment(p.siteId, min(p.createdAt)) from Post p "
        + "where p.siteId in :siteIds and p.issue = true and p.resolvedAt is null and p.deletedAt is null "
        + "group by p.siteId")
    List<SiteMoment> findOldestOpenIssueAt(Collection<UUID> siteIds);

    /** Şantiyenin o günkü yoklama mesajı; silinmemiş olan günde bir tanedir (posts_roll_call_uniq). */
    Optional<Post> findBySiteIdAndRollCallDayAndDeletedAtIsNull(UUID siteId, LocalDate rollCallDay);

    /** Firmada yoklama mesajı atılmış günler (silinenler sayılmaz). */
    @Query("select distinct p.rollCallDay from Post p where p.companyId = :companyId and p.deletedAt is null "
        + "and p.rollCallDay between :from and :to")
    List<LocalDate> findRollCallDays(UUID companyId, LocalDate from, LocalDate to);

    /** Şantiyenin sabit mesajları, en son sabitlenen önde (akışın üstündeki şerit). */
    @Query("select p from Post p where p.siteId = :siteId and p.pinnedAt is not null order by p.pinnedAt desc")
    List<Post> findPinned(UUID siteId);

    /**
     * Mesaj araması: yazısında aranan geçen, silinmemiş mesajlar, en yeniden eskiye. Desen küçük harfe
     * çevrilmiş ve joker karakterleri kaçırılmış gelir.
     */
    @Query("select p from Post p where p.siteId in :siteIds and p.deletedAt is null "
        + "and lower(p.body) like :pattern escape '\\' order by p.createdAt desc")
    List<Post> search(Collection<UUID> siteIds, String pattern, Pageable page);

    /** Şantiye başına en son gönderi (ana ekrandaki önizleme). Aynı ana düşen ikiziyle birlikte gelebilir. */
    @Query("select p from Post p where p.siteId in :siteIds and p.deletedAt is null and p.createdAt = "
        + "(select max(q.createdAt) from Post q where q.siteId = p.siteId and q.deletedAt is null)")
    List<Post> findLatestPerSite(Collection<UUID> siteIds);
}
