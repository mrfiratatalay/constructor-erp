package com.atalay.santiye.onboarding;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface OnboardingInviteRepository extends JpaRepository<OnboardingInvite, UUID> {

    Optional<OnboardingInvite> findByTokenHash(String tokenHash);

    List<OnboardingInvite> findByCompanyIdAndStatus(UUID companyId, OnboardingInviteStatus status);
}
