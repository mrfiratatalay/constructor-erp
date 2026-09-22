package com.atalay.santiye.post;

import com.atalay.santiye.common.persistence.SiteCount;
import com.atalay.santiye.common.persistence.SiteMoment;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("select p from Post p where p.siteId in :siteIds order by p.createdAt desc, p.id desc")
    List<Post> findNewest(Collection<UUID> siteIds, Pageable page);

    /** İmleçten (zaman, kimlik) daha eskiler: aynı saniyedeki gönderiler kimlikle ayrışır, hiçbiri atlanmaz. */
    @Query("""
        select p from Post p where p.siteId in :siteIds
        and (p.createdAt < :createdAt or (p.createdAt = :createdAt and p.id < :id))
        order by p.createdAt desc, p.id desc""")
    List<Post> findOlderThan(Collection<UUID> siteIds, Instant createdAt, UUID id, Pageable page);

    @Query("select p from Post p where p.siteId in :siteIds and p.issue = true and p.resolvedAt is null "
        + "order by p.createdAt desc")
    List<Post> findOpenIssues(Collection<UUID> siteIds);

    @Query("select p from Post p where p.siteId in :siteIds and p.issue = true and p.resolvedAt is not null "
        + "order by p.resolvedAt desc")
    List<Post> findResolvedIssues(Collection<UUID> siteIds, Pageable page);

    @Query("select new com.atalay.santiye.common.persistence.SiteMoment(p.siteId, max(p.createdAt)) "
        + "from Post p where p.siteId in :siteIds group by p.siteId")
    List<SiteMoment> findLastPostAt(Collection<UUID> siteIds);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(p.siteId, count(p)) "
        + "from Post p where p.siteId in :siteIds and p.createdAt >= :since group by p.siteId")
    List<SiteCount> countPostsSince(Collection<UUID> siteIds, Instant since);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(p.siteId, count(p)) "
        + "from Post p where p.siteId in :siteIds and p.issue = true and p.resolvedAt is null group by p.siteId")
    List<SiteCount> countOpenIssues(Collection<UUID> siteIds);
}
