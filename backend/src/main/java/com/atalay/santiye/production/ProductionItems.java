package com.atalay.santiye.production;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.production.dto.CrewRef;
import com.atalay.santiye.production.dto.ProductionItemRequest;
import com.atalay.santiye.production.dto.ProductionItemView;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * İmalat açmak, düzeltmek, silmek (yalnızca şef; controller denetler). Girişi olan imalat silinmez: girişler
 * şantiyenin kaydıdır, önce onlar silinir.
 */
@Service
public class ProductionItems {

    private final ProductionItemRepository items;
    private final ProductionEntryRepository entries;
    private final ProductionReads reads;
    private final ProductionLookups lookups;
    private final SiteAccess siteAccess;
    private final Clock clock;

    ProductionItems(ProductionItemRepository items, ProductionEntryRepository entries, ProductionReads reads,
        ProductionLookups lookups, SiteAccess siteAccess, Clock clock) {
        this.items = items;
        this.entries = entries;
        this.reads = reads;
        this.lookups = lookups;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional
    public ProductionItemView create(CurrentUser user, UUID siteId, ProductionItemRequest request) {
        siteAccess.requireVisible(user, siteId);
        ProductionItem item = new ProductionItem(siteId, user.companyId(), user.userId(), clock.instant());
        describe(user, item, request);
        return reads.view(user, items.save(item));
    }

    @Transactional
    public ProductionItemView update(CurrentUser user, UUID itemId, ProductionItemRequest request) {
        ProductionItem item = reads.require(user, itemId);
        describe(user, item, request);
        return reads.view(user, item);
    }

    @Transactional
    public void delete(CurrentUser user, UUID itemId) {
        ProductionItem item = reads.require(user, itemId);
        if (entries.existsByItemIdAndDeletedAtIsNull(itemId)) {
            throw ApiException.conflict("Girişi olan imalat silinmez: önce günlük girişlerini sil.");
        }
        item.delete(clock.instant());
    }

    /** Taşeron yoklama listesindeki bir ekip olmalı; imalatın zaten bağlı olduğu (sonradan çıkmış) ekip kalabilir. */
    private void describe(CurrentUser user, ProductionItem item, ProductionItemRequest request) {
        if (request.startDate() != null && request.plannedEnd() != null
            && request.plannedEnd().isBefore(request.startDate())) {
            throw ApiException.badRequest("Planlanan bitiş, başlangıçtan önce olamaz.");
        }
        UUID crewId = request.crewId();
        if (crewId != null && !crewId.equals(item.getCrewId())) {
            CrewRef crew = lookups.crews(user.companyId()).get(crewId);
            if (crew == null || crew.archived()) {
                throw ApiException.badRequest("Taşeron bulunamadı: yoklama listesindeki bir ekip seçilmeli.");
            }
        }
        item.describe(request);
    }
}
