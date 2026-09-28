package com.atalay.santiye.material.dto;

import java.util.List;

/**
 * Hareket listesinin bir sayfası. total: süzgeçlere uyan bütün hareketler. counts: tür çiplerindeki sayılar; tür
 * süzgeci hariç öbür süzgeçlerle sayılır ("Transfer 18" çipi Transfer seçiliyken de doğru sayıyı gösterir).
 */
public record MovementPage(List<MovementRow> items, long total, int page, int size, MovementTypeCounts counts) {
}
