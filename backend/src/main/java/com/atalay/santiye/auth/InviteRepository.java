package com.atalay.santiye.auth;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface InviteRepository extends JpaRepository<Invite, UUID> {

    /**
     * Link kullanılırken satır kilitlenir: aynı link aynı anda iki kez açılırsa ikinci istek birincinin bitmesini bekler
     * ve kullanıldığını görür. Kilitsiz ikisi de oturum alırdı; linki ele geçiren, sahibiyle aynı anda girip fark edilmezdi.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Invite> findByTokenHash(String tokenHash);

    @Modifying
    @Query("delete from Invite i where i.userId = :userId and i.usedAt is null")
    void deleteUnusedByUserId(UUID userId);
}
