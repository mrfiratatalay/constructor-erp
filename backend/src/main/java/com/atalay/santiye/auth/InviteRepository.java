package com.atalay.santiye.auth;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface InviteRepository extends JpaRepository<Invite, UUID> {

    Optional<Invite> findByTokenHash(String tokenHash);

    @Modifying
    @Query("delete from Invite i where i.userId = :userId and i.usedAt is null")
    void deleteUnusedByUserId(UUID userId);
}
