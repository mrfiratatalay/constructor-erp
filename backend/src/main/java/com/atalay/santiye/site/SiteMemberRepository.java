package com.atalay.santiye.site;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface SiteMemberRepository extends JpaRepository<SiteMember, SiteMemberId> {

    @Query("select m.id.siteId from SiteMember m where m.id.userId = :userId")
    List<UUID> findSiteIdsByUserId(UUID userId);

    @Query("select m from SiteMember m where m.id.siteId in :siteIds")
    List<SiteMember> findBySiteIds(Collection<UUID> siteIds);

    @Query("select m from SiteMember m where m.id.userId in :userIds")
    List<SiteMember> findByUserIds(Collection<UUID> userIds);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from SiteMember m where m.id.userId = :userId")
    void deleteByUserId(UUID userId);
}
