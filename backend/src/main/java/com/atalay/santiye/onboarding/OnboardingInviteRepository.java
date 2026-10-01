package com.atalay.santiye.onboarding;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

interface OnboardingInviteRepository extends JpaRepository<OnboardingInvite, UUID> {

    Optional<OnboardingInvite> findByTokenHash(String tokenHash);

    /** Kurulum tamamlanırken satır kilitlenir: aynı link aynı anda iki kez gönderilirse ikincisi kullanıldığını görür. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from OnboardingInvite i where i.tokenHash = :tokenHash")
    Optional<OnboardingInvite> findLockedByTokenHash(String tokenHash);

    List<OnboardingInvite> findByCompanyIdAndStatus(UUID companyId, OnboardingInviteStatus status);
}
