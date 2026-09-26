package com.atalay.santiye.rollcall.dto;

import java.util.UUID;

/** Yoklamadaki kişi: firmanın patron olmayan bir kişisi. */
public record RollCallMember(UUID id, String fullName) {
}
