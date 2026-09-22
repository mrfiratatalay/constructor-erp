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
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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

    @Transactional
    public MemberCreatedResponse createMember(CurrentUser owner, CreateMemberRequest request) {
        AppUser member = new AppUser(owner.companyId(), request.fullName().trim(), request.role(), clock.instant());
        member.updateProfile(member.getFullName(), blankToNull(request.phone()), request.role());
        users.save(member);
        memberships.assign(owner.companyId(), member.getId(), request.siteIds());
        return new MemberCreatedResponse(toView(member, null, request.siteIds()), invites.issue(member));
    }

    @Transactional
    public MemberView updateMember(CurrentUser owner, UUID memberId, UpdateMemberRequest request) {
        AppUser member = findMember(owner, memberId);
        if (member.getId().equals(owner.userId()) && (!request.active() || request.role() != member.getRole())) {
            throw ApiException.badRequest("Kendi hesabını pasif yapamaz ya da rolünü değiştiremezsin.");
        }
        member.updateProfile(request.fullName().trim(), blankToNull(request.phone()), request.role());
        member.setActive(request.active());
        memberships.assign(owner.companyId(), member.getId(), request.siteIds());
        if (!request.active()) {
            sessions.closeAll(member.getId());
        }
        return toView(member, sessions.lastSeen(List.of(memberId)).get(memberId), request.siteIds());
    }

    @Transactional
    public InviteLink issueLoginLink(CurrentUser owner, UUID memberId) {
        AppUser member = findMember(owner, memberId);
        if (!member.isActive()) {
            throw ApiException.badRequest("Pasif bir kişiye giriş linki gönderilemez.");
        }
        return invites.issue(member);
    }

    private AppUser findMember(CurrentUser owner, UUID memberId) {
        return users.findByIdAndCompanyId(memberId, owner.companyId())
            .orElseThrow(() -> ApiException.notFound("Kişi bulunamadı."));
    }

    private static MemberView toView(AppUser user, Instant lastSeenAt, List<UUID> siteIds) {
        return new MemberView(
            user.getId(), user.getFullName(), user.getPhone(), user.getRole(), user.isActive(), lastSeenAt, siteIds);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
