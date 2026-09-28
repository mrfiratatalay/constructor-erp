package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.util.List;

/**
 * Hareketin ayrıntısı ve geçmişi (audit). returnOf: iade ise bağlı olduğu ödünç çıkışı. returns, returnedQuantity ve
 * remainingQuantity yalnızca ödünç çıkışında doludur. systemQuantity ve countedQuantity sayım düzeltmesinde doludur.
 * fieldPosts: hareketin yansıdığı Saha gönderileri. history: oluşturma, teslim, düzeltme ve iptal satırları.
 */
public record MovementDetail(
    MovementRow movement,
    @Nullable String returnNote,
    @Nullable String reason,
    @Nullable BigDecimal systemQuantity,
    @Nullable BigDecimal countedQuantity,
    @Nullable MovementLink returnOf,
    List<ReturnLine> returns,
    @Nullable BigDecimal returnedQuantity,
    @Nullable BigDecimal remainingQuantity,
    List<DocumentView> documents,
    List<FieldPostRef> fieldPosts,
    List<HistoryEntry> history) {
}
