package com.atalay.santiye.auth.dto;

import jakarta.annotation.Nullable;
import java.util.List;

/**
 * Arayüzün açılışta bilmesi gereken her şey: kim (ve platform yöneticisi mi), hangi firmalarda üye, şu an hangi
 * firmanın çalışma alanında (markası, rolü, izinleri, açık modülleri, abonelik durumu). Firmasız platform
 * yöneticisinde workspace boştur.
 */
public record SessionContextView(
    SessionUserView user,
    List<WorkspaceOptionView> workspaces,
    @Nullable WorkspaceView workspace) {
}
