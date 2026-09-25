package com.atalay.santiye.team;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteLink;
import com.atalay.santiye.auth.InviteService;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.SiteEventKind;
import com.atalay.santiye.site.SiteEvents;
import com.atalay.santiye.team.dto.MemberView;
import com.atalay.santiye.team.dto.UpdateMemberRequest;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firmanın kişileri. Yeni kişi yalnızca firmanın bağlantısıyla, kendi adını ve numarasını yazarak gelir; patron
 * numara yazmaz. Patron bir kişiyi düzeltir, patron yapar, firmadan çıkarır ya da ona giriş linki gönderir.
 */
@Service
public class TeamService {

    private final UserRepository users;
    private final InviteService invites;
    private final SessionService sessions;
    private final SiteEvents events;
    private final Clock clock;

    TeamService(UserRepository users, InviteService invites, SessionService sessions, SiteEvents events, Clock clock) {
        this.users = users;
        this.invites = invites;
        this.sessions = sessions;
        this.events = events;
        this.clock = clock;
    }

    /**
     * Bağlantıyla gelen kişi kendini şef olarak ekler. Numara firmada aktif birinin ise yeni hesap açılmaz: kimse
     * başkasının numarasını yazıp onun yerine giremesin; o kişi patrondan giriş linki ister. Firmadan çıkarılmış
     * birinin numarasıysa eski kaydı geri açılır: yazdıkları zaten şantiyelerde duruyor, kişi aynı kişi.
     */
    @Transactional
    public AppUser joinByLink(UUID companyId, String fullName, String phone) {
        if (fullName == null || fullName.isBlank()) {
            throw ApiException.badRequest("Adını yaz.");
        }
        String checked = checkedPhone(phone);
        Optional<AppUser> holder = holderOf(companyId, checked, null);
        if (holder.filter(AppUser::isActive).isPresent()) {
            throw ApiException.badRequest("Bu numara zaten kayıtlı. Patronundan giriş linki iste.");
        }
        AppUser member = holder.orElseGet(() -> new AppUser(companyId, "", UserRole.SITE_LEAD, clock.instant()));
        member.updateProfile(PersonNames.tidy(fullName), checked, UserRole.SITE_LEAD);
        member.setActive(true);
        return users.save(member);
    }

    /**
     * Firmadan çıkarılan kişi (active=false) her cihazda oturumu kapanır, hiçbir şantiyeyi göremez; her şantiyenin
     * akışına "Patron, Mahmut'u çıkardı" düşer. Patron kendini çıkaramaz ve kendi rolünü değiştiremez: firmada her
     * zaman en az bir patron kalır.
     */
    @Transactional
    public MemberView updateMember(CurrentUser owner, UUID memberId, UpdateMemberRequest request) {
        AppUser member = findMember(owner, memberId);
        if (member.getId().equals(owner.userId()) && (!request.active() || request.role() != member.getRole())) {
            throw ApiException.badRequest("Kendini firmadan çıkaramaz ya da kendi rolünü değiştiremezsin.");
        }
        String phone = request.phone() == null || request.phone().isBlank() ? null : checkedPhone(request.phone());
        if (phone != null) {
            holderOf(owner.companyId(), phone, memberId).ifPresent(TeamService::rejectTaken);
        }
        boolean leaving = member.isActive() && !request.active();
        member.updateProfile(PersonNames.tidy(request.fullName()), phone, request.role());
        member.setActive(request.active());
        if (leaving) {
            sessions.closeAll(member.getId());
            events.recordInEverySite(owner.companyId(), SiteEventKind.MEMBER_REMOVED, owner.userId(), member.getId());
        }
        return new MemberView(member.getId(), member.getFullName(), member.getPhone(), member.getRole(),
            member.isActive());
    }

    @Transactional
    public InviteLink issueLoginLink(CurrentUser owner, UUID memberId) {
        AppUser member = findMember(owner, memberId);
        if (!member.isActive()) {
            throw ApiException.badRequest("Firmadan çıkarılmış bir kişiye giriş linki gönderilemez.");
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

    private static void rejectTaken(AppUser holder) {
        throw ApiException.badRequest("Bu numara zaten kayıtlı: " + holder.getFullName() + ".");
    }

    private static String checkedPhone(String phone) {
        if (phone == null || !PhoneNumbers.looksValid(phone)) {
            throw ApiException.badRequest("Telefon numarası eksik ya da hatalı.");
        }
        return phone.trim();
    }
}
