package com.atalay.santiye.puantaj;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface RosterEntryRepository extends JpaRepository<RosterEntry, UUID> {

    List<RosterEntry> findByCompanyId(UUID companyId);

    Optional<RosterEntry> findByIdAndCompanyId(UUID id, UUID companyId);

    Optional<RosterEntry> findByCompanyIdAndUserId(UUID companyId, UUID userId);

    /**
     * Uygulamadaki çalışanlar listeye kendiliğinden girer: firmaya katılan ya da çalışan yapılan herkesin kalemi
     * puantaj okunurken açılır. Katılma ve rol değişikliği puantajı bilmek zorunda kalmaz. Aynı anda iki okuma
     * olursa ikinci ekleme sessizce atlanır (kişi firmada tekildir).
     */
    @Modifying
    @Query(value = "insert into roster_entries (id, company_id, kind, user_id, name, created_at) "
        + "select gen_random_uuid(), m.company_id, 'PERSON', u.id, u.full_name, now() "
        + "from company_memberships m join users u on u.id = m.user_id "
        + "where m.company_id = :companyId and m.active and m.role = 'WORKER' "
        + "on conflict (company_id, user_id) do nothing", nativeQuery = true)
    int addMissingWorkers(UUID companyId);
}
