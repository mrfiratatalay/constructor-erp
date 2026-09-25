package com.atalay.santiye.join.dto;

/** Bağlantıyı açan kişinin gördüğü: hangi firma çağırıyor; bu telefonda zaten içerideyse doğrudan girer. */
public record JoinInvite(String companyName, boolean alreadyInside) {
}
