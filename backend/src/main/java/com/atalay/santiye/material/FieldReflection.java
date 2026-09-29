package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.PostService;
import com.atalay.santiye.post.dto.CreatePostForm;
import com.atalay.santiye.post.dto.PostView;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Şantiyeye dokunan sevkiyat o şantiyenin Saha akışına düşer: "Malzeme yolda: Çimento 300 Torba, Demir 2 Ton (Ana
 * Depo → Çamburnu Plaza)". Gönderi yalnızca referanstır, verinin sahibi sevkiyattır; Saha kartı güncel durumu (ör.
 * İptal) sevkiyattan okur. Transfer iki şantiye arasındaysa ikisine de düşer: biri "gönderildi", öbürü "yolda" der.
 */
@Component
class FieldReflection {

    private final PostService posts;
    private final MaterialFieldPostRepository fieldPosts;
    private final StockLocations locations;
    private final ShipmentNames names;
    private final ShipmentLineRepository lines;
    private final MaterialRepository materials;

    FieldReflection(PostService posts, MaterialFieldPostRepository fieldPosts, StockLocations locations,
        ShipmentNames names, ShipmentLineRepository lines, MaterialRepository materials) {
        this.posts = posts;
        this.fieldPosts = fieldPosts;
        this.locations = locations;
        this.names = names;
        this.lines = lines;
        this.materials = materials;
    }

    void reflect(CurrentUser user, Shipment shipment) {
        Map<UUID, Boolean> sites = sitesOf(user, shipment);
        if (sites.isEmpty()) {
            return;
        }
        FieldTexts texts = new FieldTexts(shipment, itemsOf(shipment), names.from(shipment), names.to(shipment));
        sites.forEach((siteId, arriving) -> {
            var form = new CreatePostForm(UUID.randomUUID(), siteId, texts.body(arriving), false, null, null, true);
            PostView post = posts.createPost(user, form);
            fieldPosts.save(new MaterialFieldPost(post.id(), shipment.getId(), siteId));
        });
    }

    /** Kalemler okunur haliyle: "Çimento 300 Torba". Uzun listede Saha kartı yine tek satır kalır. */
    private List<String> itemsOf(Shipment shipment) {
        return lines.findByShipmentId(shipment.getId()).stream()
            .map(line -> materials.findById(line.getMaterialId())
                .map(material -> material.getName() + " " + Quantities.withUnit(line.getQuantity(), material.getUnit()))
                .orElse(null))
            .filter(Objects::nonNull)
            .toList();
    }

    /** Sevkiyatın dokunduğu şantiyeler; değer: malzeme bu şantiyeye mi geliyor (yoksa çıkıyor mu). */
    private Map<UUID, Boolean> sitesOf(CurrentUser user, Shipment shipment) {
        Map<UUID, Boolean> sites = new LinkedHashMap<>();
        siteOf(user, shipment.getSourceId()).ifPresent(site -> sites.put(site, false));
        siteOf(user, shipment.getDestinationId()).ifPresent(site -> sites.put(site, true));
        return sites;
    }

    private Optional<UUID> siteOf(CurrentUser user, UUID locationId) {
        if (locationId == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(locations.require(user.companyId(), locationId).getSiteId());
    }
}
