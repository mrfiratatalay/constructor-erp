package com.atalay.santiye.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    /** Firma filtresi her sorguda: başka firmanın kullanıcısı hiçbir yoldan dönmez. */
    Optional<AppUser> findByIdAndCompanyId(UUID id, UUID companyId);

    List<AppUser> findByCompanyIdOrderByFullName(UUID companyId);

    List<AppUser> findByCompanyIdAndRoleAndActiveTrue(UUID companyId, UserRole role);
}
