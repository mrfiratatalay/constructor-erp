package com.atalay.santiye.production;

import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.production.dto.CrewRef;
import com.atalay.santiye.production.dto.ProductionEntryView;
import com.atalay.santiye.puantaj.RosterService;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * İmalat ekranlarının başka özelliklerden okudukları, her biri tek sorguda: taşeronların adı (puantajın ekipleri),
 * girişi yapanların adı ve girişlerin dosyaları.
 */
@Component
class ProductionLookups {

    private final RosterService roster;
    private final UserRepository users;
    private final MediaViews media;

    ProductionLookups(RosterService roster, UserRepository users, MediaViews media) {
        this.roster = roster;
        this.users = users;
        this.media = media;
    }

    Map<UUID, CrewRef> crews(UUID companyId) {
        return roster.crews(companyId).stream()
            .map(entry -> new CrewRef(entry.id(), entry.name(), entry.trade(), entry.archived()))
            .collect(Collectors.toMap(CrewRef::id, Function.identity()));
    }

    List<ProductionEntryView> entries(List<ProductionEntry> entries) {
        if (entries.isEmpty()) {
            return List.of();
        }
        List<UUID> ids = entries.stream().map(ProductionEntry::getId).toList();
        Map<UUID, List<MediaView>> files = media.byProductionEntry(ids);
        Map<UUID, String> names = users.findAllById(entries.stream().map(ProductionEntry::getCreatedBy).toList())
            .stream().collect(Collectors.toMap(AppUser::getId, AppUser::getFullName));
        return entries.stream()
            .map(entry -> ProductionViews.entry(entry, names.getOrDefault(entry.getCreatedBy(), ""),
                files.getOrDefault(entry.getId(), List.of())))
            .toList();
    }
}
