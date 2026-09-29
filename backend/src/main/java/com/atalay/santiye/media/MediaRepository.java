package com.atalay.santiye.media;

import com.atalay.santiye.common.persistence.SiteCount;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByPostIdInOrderByPosition(Collection<UUID> postIds);

    List<Media> findByProductionEntryIdInOrderByPosition(Collection<UUID> entryIds);

    List<Media> findByStatus(MediaStatus status);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(m.siteId, count(m)) from Media m "
        + "where m.siteId in :siteIds and m.kind = com.atalay.santiye.media.MediaKind.PHOTO "
        + "and (m.postId is not null or m.productionEntryId is null) "
        + "and m.createdAt >= :since group by m.siteId")
    List<SiteCount> countPhotosSince(Collection<UUID> siteIds, Instant since);

    /**
     * Bugünün hazır fotoğrafları, en yeniden eskiye. Günde birkaç düzine; şantiye başına en yeni seçilir. Saha'ya
     * yansıtılmamış imalat fotoğrafı sayılmaz: onu yalnızca imalatı görenler görür (sayaçta da aynı kural).
     */
    @Query("select m from Media m where m.siteId in :siteIds and m.kind = com.atalay.santiye.media.MediaKind.PHOTO "
        + "and (m.postId is not null or m.productionEntryId is null) and m.status = com.atalay.santiye.media.MediaStatus.READY and m.createdAt >= :since order by m.createdAt desc")
    List<Media> findReadyPhotosSince(Collection<UUID> siteIds, Instant since);

    /**
     * Şantiyenin "Medya ve belgeler"i: gönderilerdeki hazır fotoğraf, video ve belgeler, en yeniden eskiye.
     * Sesli notlar sohbetin parçasıdır, galeriye girmez; şantiyenin kendi fotoğrafı (gönderisiz) da girmez.
     */
    @Query("select m from Media m where m.siteId = :siteId and m.postId is not null "
        + "and m.status = com.atalay.santiye.media.MediaStatus.READY "
        + "and m.kind <> com.atalay.santiye.media.MediaKind.AUDIO order by m.createdAt desc")
    List<Media> findLibrary(UUID siteId, Pageable page);

    /** İşleme uzun sürer ve işlem dışında yapılır; sonucu kısa bir güncellemeyle yazılır. */
    @Transactional
    @Modifying
    @Query("update Media m set m.status = :status, m.durationSeconds = :durationSeconds where m.id = :id")
    void finish(UUID id, MediaStatus status, Double durationSeconds);
}
