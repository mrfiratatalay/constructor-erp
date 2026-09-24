package com.atalay.santiye.visit;

import com.atalay.santiye.site.SiteMembershipService;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import com.atalay.santiye.visit.dto.SeenBy;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WhatsApp'taki mavi tikin kaynağı: şantiyenin katılımcıları (firmanın patronları ve şantiyenin üyeleri)
 * ve her birinin şantiyeye son bakışı. Şantiye sayfası açılınca oradaki her mesaj görülmüş sayılır.
 */
@Service
public class SeenReceipts {

    private final SiteVisitRepository visits;
    private final SiteMembershipService memberships;
    private final UserRepository users;

    SeenReceipts(SiteVisitRepository visits, SiteMembershipService memberships, UserRepository users) {
        this.visits = visits;
        this.memberships = memberships;
        this.users = users;
    }

    /** Şantiye başına aktif katılımcılar ve son bakışları; sayfa başına sabit sayıda sorgu. */
    @Transactional(readOnly = true)
    public Map<UUID, List<SeenBy>> participantsBySite(UUID companyId, Collection<UUID> siteIds) {
        Map<UUID, List<UUID>> memberIds = memberships.userIdsBySite(siteIds);
        List<AppUser> owners = users.findByCompanyIdAndRoleAndActiveTrue(companyId, UserRole.OWNER);
        Map<UUID, AppUser> members = users.findAllById(memberIds.values().stream().flatMap(List::stream).toList())
            .stream().filter(AppUser::isActive).collect(Collectors.toMap(AppUser::getId, Function.identity()));
        Map<SiteVisitId, Instant> seen = visits.findBySiteIds(siteIds).stream()
            .collect(Collectors.toMap(SiteVisit::getId, SiteVisit::getSeenAt));
        return siteIds.stream().distinct().collect(Collectors.toMap(Function.identity(), siteId -> {
            Stream<AppUser> siteMembers = memberIds.getOrDefault(siteId, List.of()).stream()
                .map(members::get).filter(user -> user != null && user.getRole() != UserRole.OWNER);
            return Stream.concat(owners.stream(), siteMembers)
                .map(user -> new SeenBy(user.getId(), user.getFullName(), seen.get(new SiteVisitId(user.getId(), siteId))))
                .toList();
        }));
    }
}
