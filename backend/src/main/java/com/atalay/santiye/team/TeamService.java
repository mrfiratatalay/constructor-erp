package com.atalay.santiye.team;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteLink;
import com.atalay.santiye.auth.InviteService;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.SiteMembershipService;
import com.atalay.santiye.team.dto.CreateMemberRequest;
import com.atalay.santiye.team.dto.MemberCreatedResponse;
import com.atalay.santiye.team.dto.MemberView;
import com.atalay.santiye.team.dto.UpdateMemberRequest;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamService {

    private final UserRepository users;
    private final InviteService invites;
    private final SessionService sessions;
    private final SiteMembershipService memberships;
    private final Clock clock;

    TeamService(UserRepository users, InviteService invites, SessionService sessions,
        SiteMembershipService memberships, Clock clock) {
        this.users = users;
        this.invites = invites;
        this.sessions = sessions;
        this.memberships = memberships;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<MemberView> listMembers(CurrentUser owner) {
        List<AppUser> members = users.findByCompanyIdOrderByFullName(owner.companyId());
        List<UUID> ids = members.stream().map(AppUser::getId).toList();
        Map<UUID, Instant> lastSeen = sessions.lastSeen(ids);
        Map<UUID, List<UUID>> siteIds = memberships.siteIdsByUser(ids);
        return members.stream()
            .map(member -> toView(member, lastSeen.get(member.getId()), siteIds.getOrDefault(member.getId(), List.of())))
            .toList();
    }

    /**
     * Aynı numara ekipteyse ikinci kez eklenmez. Ekipten çıkarılmış birinin numarasıysa eski kaydı geri açılır:
     * yazdıkları zaten şantiyelerde duruyor, kişi aynı kişi.
     */
    @Transactional
    public MemberCreatedResponse createMember(CurrentUser owner, CreateMemberRequest request) {
        String phone = checkedPhone(request.phone());
        Optional<AppUser> holder = holderOf(owner.companyId(), phone, null);
        holder.filter(AppUser::isActive).ifPresent(TeamService::rejectTaken);
        AppUser member = enroll(holder.orElseGet(() -> newMember(owner.companyId(), request.role())),
            request.fullName(), phone, request.role());
        memberships.assign(owner.companyId(), member.getId(), request.siteIds(), owner.userId());
        return new MemberCreatedResponse(toView(member, null, request.siteIds()), invites.issue(member));
    }

    /**
     * Şantiye davet bağlantısıyla gelen kişi kendini ekler (şef olarak). Numara ekipte aktif birinin ise yeni hesap
     * açılmaz: kimse başkasının numarasını yazıp onun yerine giremesin. O kişi giriş linkiyle girip bağlantıya
     * yeniden dokunur. Ekipten çıkarılmış birinin numarasıysa eski kaydı geri açılır.
     */
    @Transactional
    public AppUser joinByLink(UUID companyId, String fullName, String phone) {
        if (fullName == null || fullName.isBlank()) {
            throw ApiException.badRequest("Adını yaz.");
        }
        String checked = checkedPhone(phone);
        Optional<AppUser> holder = holderOf(companyId, checked, null);
        if (holder.filter(AppUser::isActive).isPresent()) {
            throw ApiException.badRequest(
                "Bu numara zaten kayıtlı. Patronundan giriş linki iste, sonra bu bağlantıya yeniden dokun.");
        }
        return enroll(holder.orElseGet(() -> newMember(companyId, UserRole.SITE_LEAD)), fullName, checked,
            UserRole.SITE_LEAD);
    }

    /** Ekipten çıkarılan kişi (active=false) her cihazda oturumu kapanır ve bütün şantiyelerden çıkar. */
    @Transactional
    public MemberView updateMember(CurrentUser owner, UUID memberId, UpdateMemberRequest request) {
        AppUser member = findMember(owner, memberId);
        if (member.getId().equals(owner.userId()) && (!request.active() || request.role() != member.getRole())) {
            throw ApiException.badRequest("Kendi hesabını pasif yapamaz ya da rolünü değiştiremezsin.");
        }
        String phone = request.phone() == null || request.phone().isBlank() ? null : checkedPhone(request.phone());
        if (phone != null) {
            holderOf(owner.companyId(), phone, memberId).ifPresent(TeamService::rejectTaken);
        }
        member.updateProfile(PersonNames.tidy(request.fullName()), phone, request.role());
        member.setActive(request.active());
        List<UUID> siteIds = request.active() ? request.siteIds() : List.of();
        memberships.assign(owner.companyId(), member.getId(), siteIds, owner.userId());
        if (!request.active()) {
            sessions.closeAll(member.getId());
        }
        return toView(member, sessions.lastSeen(List.of(memberId)).get(memberId), siteIds);
    }

    @Transactional
    public InviteLink issueLoginLink(CurrentUser owner, UUID memberId) {
        AppUser member = findMember(owner, memberId);
        if (!member.isActive()) {
            throw ApiException.badRequest("Ekipten çıkarılmış bir kişiye giriş linki gönderilemez.");
        }
        return invites.issue(member);
    }

    private AppUser findMember(CurrentUser owner, UUID memberId) {
        return users.findByIdAndCompanyId(memberId, owner.companyId())
            .orElseThrow(() -> ApiException.notFound("Kişi bulunamadı."));
    }

    /** Firma küçük (birkaç on kişi): numaraları yazıldıkları biçimden bağımsız karşılaştırmak için hepsi okunur. */
    private Optional<AppUser> holderOf(UUID companyId, String phone, UUID exceptId) {
        return users.findByCompanyIdOrderByFullName(companyId).stream()
            .filter(user -> !user.getId().equals(exceptId) && user.getPhone() != null)
            .filter(user -> PhoneNumbers.same(user.getPhone(), phone))
            .findFirst();
    }

    private AppUser newMember(UUID companyId, UserRole role) {
        return new AppUser(companyId, "", role, clock.instant());
    }

    private AppUser enroll(AppUser member, String fullName, String phone, UserRole role) {
        member.updateProfile(PersonNames.tidy(fullName), phone, role);
        member.setActive(true);
        return users.save(member);
    }

    private static void rejectTaken(AppUser holder) {
        throw ApiException.badRequest("Bu numara zaten ekipte: " + holder.getFullName() + ".");
    }

    private static String checkedPhone(String phone) {
        if (phone == null || !PhoneNumbers.looksValid(phone)) {
            throw ApiException.badRequest("Telefon numarası eksik ya da hatalı.");
        }
        return phone.trim();
    }

    private static MemberView toView(AppUser user, Instant lastSeenAt, List<UUID> siteIds) {
        return new MemberView(
            user.getId(), user.getFullName(), user.getPhone(), user.getRole(), user.isActive(), lastSeenAt, siteIds);
    }
}
