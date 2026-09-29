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

    Optional<RosterEntry> findByUserId(UUID userId);

    /**
     * Uygulamadaki çalışanlar listeye kendiliğinden girer: firmaya katılan ya da çalışan yapılan herkesin kalemi
     * puantaj okunurken açılır. Katılma ve rol değişikliği puantajı bilmek zorunda kalmaz. Aynı anda iki okuma
     * olursa ikinci ekleme sessizce atlanır (user_id tekildir).
     */
    @Modifying
    @Query(value = "insert into roster_entries (id, company_id, kind, user_id, name, created_at) "
        + "select gen_random_uuid(), u.company_id, 'PERSON', u.id, u.full_name, now() from users u "
        + "where u.company_id = :companyId and u.active and u.role = 'WORKER' "
        + "on conflict (user_id) do nothing", nativeQuery = true)
    int addMissingWorkers(UUID companyId);
}
