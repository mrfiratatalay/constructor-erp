package com.atalay.santiye.platform.dto;

import com.atalay.santiye.audit.AuditEntryView;
import java.math.BigDecimal;
import java.util.List;

/**
 * Platformun bir bakışta durumu. openTenants: çalışma alanı bugün açık firmalar; lockedTenants: aktif ama aboneliği
 * geçersiz; suspendedTenants: askıda ya da arşivde. monthlyRecurring: açık firmaların bugünkü dönem fiyatlarının
 * toplamı (aylık tekrarlayan gelir).
 */
public record PlatformDashboardView(
    long openTenants,
    long lockedTenants,
    long suspendedTenants,
    long newTenantsThisMonth,
    long pendingSetup,
    long totalUsers,
    BigDecimal collectedThisMonth,
    BigDecimal monthlyRecurring,
    long newSalesRequests,
    List<MonthlyAmount> collections,
    List<TenantRow> expiringSoon,
    List<AuditEntryView> recentActivity) {
}
