package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.PostService;
import com.atalay.santiye.post.dto.CreatePostForm;
import com.atalay.santiye.post.dto.PostView;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Şantiyeye dokunan hareket o şantiyenin Saha akışına yansır: "Malzeme geldi: Çimento, 300 Torba (Ana Depo → Çamburnu
 * Plaza)". Gönderi yalnızca referanstır, verinin sahibi harekettir; Saha kartı güncel durumu (ör. İptal) hareketten
 * okur. Transfer iki şantiye arasındaysa ikisine de düşer: biri "gönderildi", öbürü "geldi" der.
 */
@Component
class FieldReflection {

    private final PostService posts;
    private final MaterialFieldPostRepository fieldPosts;
    private final StockLocations locations;
    private final StockLedger ledger;
    private final MaterialParties parties;

    FieldReflection(PostService posts, MaterialFieldPostRepository fieldPosts, StockLocations locations,
        StockLedger ledger, MaterialParties parties) {
        this.posts = posts;
        this.fieldPosts = fieldPosts;
        this.locations = locations;
        this.ledger = ledger;
        this.parties = parties;
    }

    void reflect(CurrentUser user, MaterialMovement movement, Material material) {
        FieldTexts texts = new FieldTexts(movement, material, sourceName(movement), destinationName(movement));
        sitesOf(user, movement).forEach((siteId, arriving) -> {
            var form = new CreatePostForm(UUID.randomUUID(), siteId, texts.body(arriving), false, null, null, true);
            PostView post = posts.createPost(user, form);
            fieldPosts.save(new MaterialFieldPost(post.id(), movement.getId(), siteId));
        });
    }

    /** Hareketin dokunduğu şantiyeler; değer: malzeme bu şantiyeye mi geliyor (yoksa çıkıyor mu). */
    private Map<UUID, Boolean> sitesOf(CurrentUser user, MaterialMovement movement) {
        Map<UUID, Boolean> sites = new LinkedHashMap<>();
        siteOf(user, movement.getSourceId()).ifPresent(site -> sites.put(site, false));
        siteOf(user, movement.getDestinationId()).ifPresent(site -> sites.put(site, true));
        return sites;
    }

    private Optional<UUID> siteOf(CurrentUser user, UUID locationId) {
        if (locationId == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(locations.require(user.companyId(), locationId).getSiteId());
    }

    /** Geldi ve iade kaynaktan değil firmadan gelir: "(ABC Yapı → Çamburnu Plaza)". */
    private String sourceName(MaterialMovement movement) {
        if (movement.getSourceId() != null) {
            return nameOf(movement.getSourceId());
        }
        return movement.getPartyId() == null ? null : parties.nameOf(movement.getPartyId());
    }

    private String destinationName(MaterialMovement movement) {
        if (movement.getDestinationId() != null) {
            return nameOf(movement.getDestinationId());
        }
        if (movement.getType() == MovementType.OUTBOUND && movement.getPartyId() != null) {
            return parties.nameOf(movement.getPartyId());
        }
        return movement.notes().usageArea();
    }

    private String nameOf(UUID locationId) {
        return locationId == null ? null : ledger.locationName(locationId);
    }
}
