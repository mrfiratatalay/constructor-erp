package com.atalay.santiye.production;

import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.production.dto.CrewRef;
import com.atalay.santiye.production.dto.ProductionEntryView;
import com.atalay.santiye.production.dto.ProductionItemView;
import java.time.LocalDate;
import java.util.List;

/** Varlıklardan ekranın görünümlerine; hesaplar (kalan, yüzde, durum) burada yapılır. */
final class ProductionViews {

    private ProductionViews() {
    }

    static ProductionItemView item(ProductionItem item, ItemProgress progress, CrewRef crew, LocalDate today) {
        var figures = new ProductionFigures(item.getTotalQuantity(), progress.done());
        return new ProductionItemView(item.getId(), item.getTrade(), item.getTitle(), item.name(), crew,
            item.getTotalQuantity(), item.getUnit(), progress.done(), figures.remaining(), figures.percent(),
            progress.today(), ProductionStatus.of(figures, item.getPlannedEnd(), today), item.getStartDate(),
            item.getPlannedEnd(), item.getNote(), progress.lastEntryAt(), item.getCreatedAt());
    }

    static ProductionEntryView entry(ProductionEntry entry, String authorName, List<MediaView> media) {
        return new ProductionEntryView(entry.getId(), entry.getItemId(), entry.getDay(), entry.getQuantity(),
            entry.getWorkerCount(), entry.getNote(), authorName, entry.getCreatedAt(), entry.getPostId() != null,
            media);
    }
}
