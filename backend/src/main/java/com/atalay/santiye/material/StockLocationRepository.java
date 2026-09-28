package com.atalay.santiye.material;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface StockLocationRepository extends JpaRepository<StockLocation, UUID> {

    Optional<StockLocation> findByIdAndCompanyId(UUID id, UUID companyId);

    boolean existsByCompanyIdAndKind(UUID companyId, LocationKind kind);

    @Query("select count(l) > 0 from StockLocation l where l.companyId = :companyId and lower(l.name) = lower(:name)")
    boolean depotNameTaken(UUID companyId, String name);

    /**
     * Her şantiye bir stok lokasyonudur: lokasyonlar okunurken eksik olanlar açılır, şantiye kurmak malzemeyi bilmek
     * zorunda kalmaz (puantajdaki çalışan kalemleri gibi). Aynı anda iki okuma olursa ikinci ekleme atlanır.
     */
    @Modifying
    @Query(value = "insert into stock_locations (id, company_id, kind, site_id, created_at) "
        + "select gen_random_uuid(), s.company_id, 'SITE', s.id, now() from sites s where s.company_id = :companyId "
        + "on conflict (site_id) do nothing", nativeQuery = true)
    int addMissingSites(UUID companyId);
}
