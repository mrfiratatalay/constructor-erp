package com.atalay.santiye.join;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface SiteInviteRepository extends JpaRepository<SiteInvite, UUID> {

    Optional<SiteInvite> findByTokenHash(String tokenHash);
}
