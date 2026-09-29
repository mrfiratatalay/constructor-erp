package com.atalay.santiye.auth;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface UserSessionRepository extends JpaRepository<UserSession, UUID> {

    Optional<UserSession> findByTokenHash(String tokenHash);

    @Modifying
    @Query("delete from UserSession s where s.tokenHash = :tokenHash")
    void deleteByTokenHash(String tokenHash);

    /** Kişi bir firmadan çıkarılınca yalnızca o firmada açık oturumları kapanır; başka firmadaki işi sürer. */
    @Modifying
    @Query("delete from UserSession s where s.userId = :userId and s.companyId = :companyId")
    void deleteAllInCompany(UUID userId, UUID companyId);
}
