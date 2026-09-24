package com.atalay.santiye.join;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteProperties;
import com.atalay.santiye.auth.SecureTokens;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.join.dto.JoinSiteRequest;
import com.atalay.santiye.join.dto.SiteInviteLink;
import com.atalay.santiye.join.dto.SiteInviteView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.site.SiteMembershipService;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.team.TeamService;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import jakarta.annotation.Nullable;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyeye davet bağlantısı, WhatsApp'taki gruba davet bağlantısı gibi: patron WhatsApp'tan gönderir (kişiyi
 * WhatsApp'ın kendi rehberinden seçer), açan kişi adını ve numarasını yazıp katılır. Patron hiç numara yazmaz.
 */
@Service
public class SiteInviteService {

    private static final Duration LIFETIME = Duration.ofDays(7);
    private static final String INVALID =
        "Bu davet bağlantısı geçersiz ya da süresi dolmuş. Patronundan yeni bir bağlantı iste.";

    private final SiteInviteRepository invites;
    private final SiteRepository sites;
    private final SiteAccess siteAccess;
    private final UserRepository users;
    private final TeamService team;
    private final SiteMembershipService memberships;
    private final InviteProperties properties;
    private final Clock clock;

    SiteInviteService(SiteInviteRepository invites, SiteRepository sites, SiteAccess siteAccess, UserRepository users,
        TeamService team, SiteMembershipService memberships, InviteProperties properties, Clock clock) {
        this.invites = invites;
        this.sites = sites;
        this.siteAccess = siteAccess;
        this.users = users;
        this.team = team;
        this.memberships = memberships;
        this.properties = properties;
        this.clock = clock;
    }

    @Transactional
    public SiteInviteLink create(CurrentUser owner, UUID siteId) {
        Site site = siteAccess.requireVisible(owner, siteId);
        String token = SecureTokens.generate();
        Instant now = clock.instant();
        SiteInvite invite = invites.save(
            new SiteInvite(site.getId(), owner.userId(), SecureTokens.hash(token), now, now.plus(LIFETIME)));
        return new SiteInviteLink(properties.baseUrl() + "/katil/" + token, invite.getExpiresAt());
    }

    @Transactional(readOnly = true)
    public SiteInviteView describe(String token, @Nullable CurrentUser viewer) {
        SiteInvite invite = usable(token);
        Site site = siteOf(invite);
        String inviter = users.findById(invite.getCreatedBy()).map(AppUser::getFullName).orElse("Patron");
        return new SiteInviteView(site.getId(), site.getName(), inviter, isInside(viewer, site));
    }

    /**
     * Bu telefonda oturumu açık olan (aynı firmadan) tek dokunuşla katılır; açık değilse adını ve numarasını
     * yazar, hesabı açılır. Zaten içerideyse bağlantı harcanmaz, başkası için geçerli kalır.
     */
    @Transactional
    public Joined accept(String token, @Nullable CurrentUser viewer, JoinSiteRequest request) {
        SiteInvite invite = usable(token);
        Site site = siteOf(invite);
        if (isInside(viewer, site)) {
            return new Joined(site.getId(), null);
        }
        boolean signedIn = sameCompany(viewer, site);
        AppUser member = signedIn
            ? users.findById(viewer.userId()).orElseThrow(() -> ApiException.badRequest(INVALID))
            : team.joinByLink(site.getCompanyId(), request.fullName(), request.phone());
        memberships.join(site.getId(), member.getId());
        invite.markUsed(member.getId(), clock.instant());
        return new Joined(site.getId(), signedIn ? null : member);
    }

    private SiteInvite usable(String token) {
        Instant now = clock.instant();
        return invites.findByTokenHash(SecureTokens.hash(token))
            .filter(invite -> invite.isUsable(now))
            .orElseThrow(() -> ApiException.badRequest(INVALID));
    }

    private Site siteOf(SiteInvite invite) {
        return sites.findById(invite.getSiteId()).orElseThrow(() -> ApiException.badRequest(INVALID));
    }

    /** Patron her şantiyenin içindedir; şef ise katılımcıysa. */
    private boolean isInside(@Nullable CurrentUser viewer, Site site) {
        return sameCompany(viewer, site)
            && (viewer.isOwner() || memberships.isMember(site.getId(), viewer.userId()));
    }

    private static boolean sameCompany(@Nullable CurrentUser viewer, Site site) {
        return viewer != null && viewer.companyId().equals(site.getCompanyId());
    }
}
