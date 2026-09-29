package com.atalay.santiye.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Kimlik deposu. Firmaya göre kişi aramak burada değil üyelikte yapılır (tenant.Members): kişi listesinin firma
 * filtresi tek yerde durur.
 */
public interface UserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByPlatformRole(PlatformRole platformRole);
}
