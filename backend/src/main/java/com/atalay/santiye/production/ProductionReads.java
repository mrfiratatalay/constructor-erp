package com.atalay.santiye.production;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.production.dto.CrewRef;
import com.atalay.santiye.production.dto.ProductionBoardView;
import com.atalay.santiye.production.dto.ProductionDetailView;
import com.atalay.santiye.production.dto.ProductionEntryView;
import com.atalay.santiye.production.dto.ProductionItemView;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * İmalatın okunan yüzü: şantiyenin İmalat sekmesi, bir imalatın detayı ve seçilebilecek taşeronlar. Kimin
 * okuyabildiğine (patron, şef, depo sorumlusu) controller karar verir; burada firma ve şantiye denetlenir.
 */
@Service
public class ProductionReads {

    private static final int RECENT_ENTRIES = 20;

    private final ProductionItemRepository items;
    private final ProductionEntryRepository entries;
    private final ProductionLookups lookups;
    private final SiteAccess siteAccess;
    private final Clock clock;

    ProductionReads(ProductionItemRepository items, ProductionEntryRepository entries, ProductionLookups lookups,
        SiteAccess siteAccess, Clock clock) {
        this.items = items;
        this.entries = entries;
        this.lookups = lookups;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public ProductionBoardView board(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        LocalDate today = LocalDate.now(clock);
        Map<UUID, ItemProgress> progress = entries.progressOf(siteId, today).stream()
            .collect(Collectors.toMap(ProductionEntryRepository.ProgressRow::getItemId, ItemProgress::of));
        Map<UUID, CrewRef> crews = lookups.crews(user.companyId());
        List<ProductionItemView> views = items.findBySiteIdAndDeletedAtIsNullOrderByCreatedAt(siteId).stream()
            .map(item -> ProductionViews.item(item, progress.getOrDefault(item.getId(), ItemProgress.NONE),
                crews.get(item.getCrewId()), today))
            .toList();
        var recent = entries.findRecent(siteId, PageRequest.of(0, RECENT_ENTRIES));
        return new ProductionBoardView(views, lookups.entries(recent));
    }

    @Transactional(readOnly = true)
    public ProductionDetailView detail(CurrentUser user, UUID itemId) {
        ProductionItem item = require(user, itemId);
        List<ProductionEntry> list = entries.findByItemIdAndDeletedAtIsNullOrderByDayDescCreatedAtDesc(itemId);
        return new ProductionDetailView(view(user, item, list), lookups.entries(list));
    }

    /** Yeni imalatta seçilebilecek taşeronlar: listede duran ekipler, ada göre. */
    @Transactional(readOnly = true)
    public List<CrewRef> crews(CurrentUser user) {
        return lookups.crews(user.companyId()).values().stream()
            .filter(crew -> !crew.archived())
            .sorted(Comparator.comparing(CrewRef::name, String.CASE_INSENSITIVE_ORDER))
            .toList();
    }

    /** Excel'in "Günlük girişler" sayfası: silinmemiş imalatların bütün girişleri, günün sırasıyla. */
    @Transactional(readOnly = true)
    public List<ProductionEntryView> allEntries(UUID siteId) {
        return lookups.entries(entries.findAllOfSite(siteId));
    }

    ProductionItemView view(CurrentUser user, ProductionItem item) {
        return view(user, item, entries.findByItemIdAndDeletedAtIsNullOrderByDayDescCreatedAtDesc(item.getId()));
    }

    ProductionEntryView entryView(ProductionEntry entry) {
        return lookups.entries(List.of(entry)).getFirst();
    }

    /** Başka firmanın ya da silinmiş imalatın varlığı belli edilmez: bulunamadı. */
    ProductionItem require(CurrentUser user, UUID itemId) {
        return items.findByIdAndCompanyIdAndDeletedAtIsNull(itemId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("İş kalemi bulunamadı."));
    }

    private ProductionItemView view(CurrentUser user, ProductionItem item, List<ProductionEntry> list) {
        LocalDate today = LocalDate.now(clock);
        CrewRef crew = item.getCrewId() == null ? null : lookups.crews(user.companyId()).get(item.getCrewId());
        return ProductionViews.item(item, ItemProgress.of(list, today), crew, today);
    }
}
