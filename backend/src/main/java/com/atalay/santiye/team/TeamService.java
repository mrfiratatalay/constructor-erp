package com.atalay.santiye.team;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteLink;
import com.atalay.santiye.auth.InviteService;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.billing.PlanLimits;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.SiteEventKind;
import com.atalay.santiye.site.SiteEvents;
import com.atalay.santiye.team.dto.MemberView;
import com.atalay.santiye.team.dto.UpdateMemberRequest;
import com.atalay.santiye.tenant.Member;
import com.atalay.santiye.tenant.Members;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.MembershipRepository;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firmanın kişileri. Yeni kişi yalnızca firmanın bağlantısıyla, kendi adını ve numarasını yazarak gelir; patron
 * numara yazmaz. Patron bir kişiyi düzeltir, patron yapar, firmadan çıkarır ya da ona giriş linki gönderir. Rol ve
 * "firmada mı" üyeliğin, ad ve numara kişinin kimliğinindir.
 */
@Service
public class TeamService {

    private final UserRepository users;
    private final MembershipRepository memberships;
    private final Members members;
    private final InviteService invites;
    private final SessionService sessions;
    private final SiteEvents events;
    private final PlanLimits limits;
    private final Workspaces workspaces;
    private final Clock clock;

    TeamService(UserRepository users, MembershipRepository memberships, Members members, InviteService invites,
        SessionService sessions, SiteEvents events, PlanLimits limits, Workspaces workspaces, Clock clock) {
        this.users = users;
        this.memberships = memberships;
        this.members = members;
        this.invites = invites;
        this.sessions = sessions;
        this.events = events;
        this.limits = limits;
        this.workspaces = workspaces;
        this.clock = clock;
    }

    /**
     * Bağlantıyla gelen kişi kendini çalışan olarak ekler; şefi patron seçer. Numara firmada aktif birinin ise yeni
     * hesap açılmaz: kimse başkasının numarasını yazıp onun yerine giremesin; o kişi patrondan giriş linki ister.
     * Gelen kişiye her zaman yeni bir hesap açılır. Numara doğrulanmadığı için firmadan çıkarılmış birinin numarasını
     * yazan onun kimliğini (mesajları, puantajı, başka firmaları) devralamaz; çıkarılanın yazdıkları onun adıyla kalır.
     */
    @Transactional
    public AppUser joinByLink(UUID companyId, String fullName, String phone) {
        if (fullName == null || fullName.isBlank()) {
            throw ApiException.badRequest("Adını yaz.");
        }
        String checked = checkedPhone(phone);
        if (activeHolderOf(companyId, checked, null).isPresent()) {
            throw ApiException.badRequest("Bu numara zaten kayıtlı. Patronundan giriş linki iste.");
        }
        limits.requireSeat(companyId);
        AppUser person = new AppUser(PersonNames.tidy(fullName), clock.instant());
        person.updateProfile(PersonNames.tidy(fullName), checked);
        users.save(person);
        memberships.save(new Membership(companyId, person.getId(), UserRole.WORKER, clock.instant()));
        return person;
    }

    /**
     * Firmadan çıkarılan kişinin o firmadaki oturumları kapanır, hiçbir şantiyeyi göremez; her şantiyenin akışına
     * "Patron, Mahmut'u çıkardı" düşer. Patron kendini çıkaramaz ve kendi rolünü değiştiremez: firmada her zaman en
     * az bir patron kalır.
     */
    @Transactional
    public MemberView updateMember(CurrentUser owner, UUID memberId, UpdateMemberRequest request) {
        Member member = findMember(owner, memberId);
        String phone = checkedChange(owner, member, request);
        boolean leaving = member.isActive() && !request.active();
        member.user().updateProfile(PersonNames.tidy(request.fullName()), phone);
        member.membership().changeRole(request.role());
        member.membership().setActive(request.active());
        if (leaving) {
            sessions.closeAllIn(member.getId(), owner.companyId());
            events.recordInEverySite(owner.companyId(), SiteEventKind.MEMBER_REMOVED, owner.userId(), member.getId());
        }
        return new MemberView(member.getId(), member.getFullName(), member.getPhone(), member.getRole(),
            member.isActive());
    }

    /**
     * Değişiklik geçerli mi; geçerliyse yazılacak numarayı döner. Geri alınan kişi paketin kullanıcı sınırına sayılır.
     */
    private String checkedChange(CurrentUser owner, Member member, UpdateMemberRequest request) {
        if (member.getId().equals(owner.userId()) && (!request.active() || request.role() != member.getRole())) {
            throw ApiException.badRequest("Kendini firmadan çıkaramaz ya da kendi rolünü değiştiremezsin.");
        }
        String phone = request.phone() == null || request.phone().isBlank() ? null : checkedPhone(request.phone());
        requireOwnIdentity(owner, member, PersonNames.tidy(request.fullName()), phone);
        if (phone != null) {
            activeHolderOf(owner.companyId(), phone, member.getId()).ifPresent(TeamService::rejectTaken);
        }
        if (!member.isActive() && request.active()) {
            limits.requireSeat(owner.companyId());
        }
        return phone;
    }

    /**
     * Ad ve numara kişinin kimliğidir. Şifreyle giren biri başka firmalarda da aynı kimlikle görünür: onun adını ve
     * numarasını yalnızca kendisi değiştirir, bu firmanın patronu başka bir firmadaki kaydı değiştiremez.
     */
    private void requireOwnIdentity(CurrentUser owner, Member member, String fullName, String phone) {
        boolean changes = !Objects.equals(member.getFullName(), fullName) || !Objects.equals(member.getPhone(), phone);
        boolean someoneElse = !member.getId().equals(owner.userId());
        if (changes && someoneElse && !workspaces.isConfinedTo(member.user(), owner.companyId())) {
            throw ApiException.badRequest("Bu kişinin adını ve numarasını yalnızca kendisi değiştirebilir.");
        }
    }

    /**
     * Giriş linki kimliği olduğu gibi devreder: yalnızca kimliğinin tamamı bu firmada olan saha hesabına verilir.
     * Şifreyle giren biri kendi şifresiyle girer; ona link üretilebilseydi bu firmanın patronu onun yerine oturum açıp
     * onun başka firmalarına ya da platform yönetimine geçebilirdi.
     */
    @Transactional
    public InviteLink issueLoginLink(CurrentUser owner, UUID memberId) {
        Member member = findMember(owner, memberId);
        if (!member.isActive()) {
            throw ApiException.badRequest("Firmadan çıkarılmış bir kişiye giriş linki gönderilemez.");
        }
        if (!workspaces.isConfinedTo(member.user(), owner.companyId())) {
            throw ApiException.badRequest("Bu kişi kendi e-posta ve şifresiyle giriyor; giriş linki yalnızca firmanın "
                + "bağlantısıyla katılan ekibe gönderilir.");
        }
        return invites.issue(member.user(), owner.companyId());
    }

    private Member findMember(CurrentUser owner, UUID memberId) {
        return members.find(owner.companyId(), memberId).orElseThrow(() -> ApiException.notFound("Kişi bulunamadı."));
    }

    /**
     * Numarası bu olan aktif kişi. Firma küçük (birkaç on kişi): numaraları yazıldıkları biçimden bağımsız
     * karşılaştırmak için hepsi okunur. Firmadan çıkarılmış birinin eski numarası yeni gelene engel olmaz.
     */
    private Optional<Member> activeHolderOf(UUID companyId, String phone, UUID exceptId) {
        return members.activeOf(companyId).stream()
            .filter(member -> !member.getId().equals(exceptId) && member.getPhone() != null)
            .filter(member -> PhoneNumbers.same(member.getPhone(), phone))
            .findFirst();
    }

    private static void rejectTaken(Member holder) {
        throw ApiException.badRequest("Bu numara zaten kayıtlı: " + holder.getFullName() + ".");
    }

    private static String checkedPhone(String phone) {
        if (phone == null || !PhoneNumbers.looksValid(phone)) {
            throw ApiException.badRequest("Telefon numarası eksik ya da hatalı.");
        }
        return phone.trim();
    }
}
