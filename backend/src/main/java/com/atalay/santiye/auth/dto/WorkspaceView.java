package com.atalay.santiye.auth.dto;

import com.atalay.santiye.auth.Permission;
import com.atalay.santiye.user.UserRole;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.UUID;

/**
 * Çalışılan firma: marka (ad, logo), kişinin rolü ve izinleri, paketin açtığı modüller (kilitliyse boş) ve abonelik
 * durumu. Arayüz firmaya özel hiçbir şeyi koda gömmez; hepsi buradan gelir.
 */
public record WorkspaceView(
    UUID companyId,
    String name,
    String slug,
    @Nullable String logoUrl,
    @Nullable String phone,
    @Nullable String email,
    UserRole role,
    List<Permission> permissions,
    List<String> features,
    WorkspaceAccessView access) {
}
