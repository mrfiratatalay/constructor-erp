package com.atalay.santiye.team.dto;

import com.atalay.santiye.auth.InviteLink;

public record MemberCreatedResponse(MemberView member, InviteLink invite) {
}
