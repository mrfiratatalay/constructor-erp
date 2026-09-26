package com.atalay.santiye.post;

import java.time.LocalDate;
import java.util.UUID;

/** Bir yoklama mesajının yoklama modülünün bilmesi gerekenleri: hangi şantiyede, hangi günün yoklaması. */
public record RollCallMessage(UUID postId, UUID siteId, LocalDate day) {
}
