package com.atalay.santiye.material;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

interface MaterialRepository extends JpaRepository<Material, UUID> {

    Optional<Material> findByIdAndCompanyId(UUID id, UUID companyId);

    /**
     * Stoğa dokunan her iş malzemenin satırını kilitler: aynı malzemeden aynı anda iki çıkış yapılırsa ikincisi
     * birincinin sonucunu görerek stoğu yeniden hesaplar, stok eksiye düşmez.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from Material m where m.id = :id and m.companyId = :companyId")
    Optional<Material> lockByIdAndCompanyId(UUID id, UUID companyId);

    @Query("select count(m) > 0 from Material m where m.companyId = :companyId and lower(m.name) = lower(:name) "
        + "and m.id <> :exceptId")
    boolean nameTaken(UUID companyId, String name, UUID exceptId);

    @Query("select count(m) > 0 from Material m where m.companyId = :companyId and lower(m.code) = lower(:code) "
        + "and m.id <> :exceptId")
    boolean codeTaken(UUID companyId, String code, UUID exceptId);
}
