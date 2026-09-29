package com.atalay.santiye.join;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteProperties;
import com.atalay.santiye.auth.SecureTokens;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.join.dto.JoinInvite;
import com.atalay.santiye.join.dto.JoinLink;
import com.atalay.santiye.join.dto.JoinRequest;
import com.atalay.santiye.site.SiteEventKind;
import com.atalay.santiye.site.SiteEvents;
import com.atalay.santiye.team.TeamService;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firmaya katılma bağlantısı, WhatsApp'taki grup bağlantısı gibi: firma başına tek, süresiz, çok kullanımlık.
 * Firmadaki herkes onu WhatsApp grubuna atabilir; tıklayan adını ve numarasını yazar, katılır ve bütün
 * şantiyeleri görür. Sızarsa patron sıfırlar; eski bağlantı çalışmaz. İstendiği zaman yeniden paylaşılabilsin
 * diye anahtarın kendisi saklanır (oturum ve giriş linkinde olduğu gibi yalnızca özeti değil).
 */
@Service
public class CompanyJoinService {

    private static final String INVALID = "Bu bağlantı artık geçersiz. Patronundan yeni bağlantıyı iste.";

    private final CompanyRepository companies;
    private final TeamService team;
    private final SiteEvents events;
    private final Workspaces workspaces;
    private final InviteProperties properties;

    CompanyJoinService(CompanyRepository companies, TeamService team, SiteEvents events, Workspaces workspaces,
        InviteProperties properties) {
        this.companies = companies;
        this.team = team;
        this.events = events;
        this.workspaces = workspaces;
        this.properties = properties;
    }

    /** İlk istendiğinde üretilir, sonra hep aynıdır. Firmadaki herkes paylaşır. */
    @Transactional
    public JoinLink link(CurrentUser user) {
        Company company = companyOf(user);
        if (company.getJoinToken() == null) {
            company.renewJoinToken(SecureTokens.generate());
        }
        return linkOf(company);
    }

    @Transactional
    public JoinLink reset(CurrentUser owner) {
        Company company = companyOf(owner);
        company.renewJoinToken(SecureTokens.generate());
        return linkOf(company);
    }

    @Transactional(readOnly = true)
    public JoinInvite describe(String token, @Nullable CurrentUser viewer) {
        Company company = byToken(token);
        return new JoinInvite(company.getName(), isInside(viewer, company));
    }

    /**
     * Bu telefonda firmadan biri zaten içerideyse yalnızca o firmaya geçilir; değilse kişinin hesabı açılır ve her
     * şantiyenin akışına "Mahmut davet bağlantısıyla katıldı" düşer (WhatsApp'taki gibi; yapan da konu da odur).
     */
    @Transactional
    public Joined accept(String token, @Nullable CurrentUser viewer, JoinRequest request) {
        Company company = byToken(token);
        if (isInside(viewer, company)) {
            return new Joined(null, company.getId());
        }
        AppUser newcomer = team.joinByLink(company.getId(), request.fullName(), request.phone());
        events.recordInEverySite(company.getId(), SiteEventKind.MEMBER_JOINED, newcomer.getId(), newcomer.getId());
        return new Joined(newcomer, company.getId());
    }

    private Company companyOf(CurrentUser user) {
        return companies.findById(user.companyId()).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
    }

    private Company byToken(String token) {
        return companies.findByJoinToken(token).orElseThrow(() -> ApiException.badRequest(INVALID));
    }

    private JoinLink linkOf(Company company) {
        return new JoinLink(properties.baseUrl() + "/katil/" + company.getJoinToken());
    }

    /** İçeride sayılmak için bu firmada aktif üyelik gerekir; başka bir firmada oturum açık olması yetmez. */
    private boolean isInside(@Nullable CurrentUser viewer, Company company) {
        return viewer != null && workspaces.active(company.getId(), viewer.userId()).isPresent();
    }
}
