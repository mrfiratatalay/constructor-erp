package com.atalay.santiye.onboarding;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.auth.InviteProperties;
import com.atalay.santiye.auth.SecureTokens;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.onboarding.dto.OnboardingInviteView;
import com.atalay.santiye.onboarding.dto.OnboardingLink;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Kurulum linklerinin yaşamı: üret (bekleyen eskiler iptal), iptal et, geçmişi listele. */
@Service
public class OnboardingInvites {

    private final OnboardingInviteRepository invites;
    private final OnboardingProperties properties;
    private final InviteProperties links;
    private final PlatformAudit audit;
    private final JdbcClient jdbc;
    private final Clock clock;

    OnboardingInvites(OnboardingInviteRepository invites, OnboardingProperties properties, InviteProperties links,
        PlatformAudit audit, JdbcClient jdbc, Clock clock) {
        this.invites = invites;
        this.properties = properties;
        this.links = links;
        this.audit = audit;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional
    public OnboardingLink issue(UUID companyId, UUID actorId) {
        Instant now = clock.instant();
        invites.findByCompanyIdAndStatus(companyId, OnboardingInviteStatus.PENDING).forEach(old -> old.revoke(now));
        String token = SecureTokens.generate();
        OnboardingInvite invite = invites.save(new OnboardingInvite(companyId, SecureTokens.hash(token),
            now.plus(properties.lifetime()), actorId, now));
        audit.record(actorId, AuditEvent.of(AuditAction.INVITE_CREATED, companyId, "Kurulum linki üretildi")
            .with(Map.of("inviteId", invite.getId().toString())));
        return new OnboardingLink(invite.getId(), links.baseUrl() + "/kurulum/" + token, now.plus(properties.lifetime()));
    }

    @Transactional
    public void revoke(UUID companyId, UUID inviteId, UUID actorId) {
        OnboardingInvite invite = invites.findById(inviteId)
            .filter(found -> found.getCompanyId().equals(companyId))
            .orElseThrow(() -> ApiException.notFound("Kurulum linki bulunamadı."));
        if (invite.getStatus() != OnboardingInviteStatus.PENDING) {
            throw ApiException.badRequest("Yalnızca bekleyen link iptal edilebilir.");
        }
        invite.revoke(clock.instant());
        audit.record(actorId, AuditEvent.of(AuditAction.INVITE_REVOKED, companyId, "Kurulum linki iptal edildi"));
    }

    @Transactional(readOnly = true)
    public List<OnboardingInviteView> of(UUID companyId) {
        return jdbc.sql("""
            select i.id, case when i.status = 'PENDING' and i.expires_at <= :now then 'EXPIRED' else i.status end
                   as status, i.created_at, i.expires_at, i.used_at, used.full_name as used_by_name,
                   creator.full_name as created_by_name
            from tenant_onboarding_invites i
            left join users used on used.id = i.used_by
            left join users creator on creator.id = i.created_by
            where i.company_id = :company order by i.created_at desc""")
            .param("company", companyId).param("now", Timestamp.from(clock.instant()))
            .query(OnboardingInviteView.class).list();
    }

    /** Kurulum sihirbazı için: link geçerliyse davet, değilse aynı mesaj (geçersiz/süresi dolmuş ayırt edilmez). */
    OnboardingInvite requireUsable(String token) {
        return invites.findByTokenHash(SecureTokens.hash(token))
            .filter(invite -> invite.isUsable(clock.instant()))
            .orElseThrow(() -> ApiException.badRequest(
                "Bu kurulum linki geçersiz ya da süresi dolmuş. Constructor ERP ekibinden yeni link isteyin."));
    }
}
