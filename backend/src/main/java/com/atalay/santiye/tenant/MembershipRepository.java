package com.atalay.santiye.tenant;

import com.atalay.santiye.user.UserRole;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {

    Optional<Membership> findByCompanyIdAndUserId(UUID companyId, UUID userId);

    List<Membership> findByUserIdAndActiveTrueOrderByCreatedAt(UUID userId);

    long countByCompanyIdAndActiveTrue(UUID companyId);

    boolean existsByCompanyIdAndRoleAndActiveTrue(UUID companyId, UserRole role);

    /** Kişinin bu firma dışında (aktif ya da firmadan çıkarılmış) bir üyeliği var mı. */
    boolean existsByUserIdAndCompanyIdNot(UUID userId, UUID companyId);

    /** Firmanın kişileri adlarıyla birlikte, tek sorguda: kişi listesi, katılımcılar, puantaj buradan okur. */
    @Query("""
        select new com.atalay.santiye.tenant.Member(u, m) from Membership m join AppUser u on u.id = m.userId
        where m.companyId = :companyId order by u.fullName""")
    List<Member> findMembers(UUID companyId);

    @Query("""
        select new com.atalay.santiye.tenant.Member(u, m) from Membership m join AppUser u on u.id = m.userId
        where m.companyId = :companyId and m.userId = :userId""")
    Optional<Member> findMember(UUID companyId, UUID userId);
}
