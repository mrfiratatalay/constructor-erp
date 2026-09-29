package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

/**
 * Sevkiyatın şantiyenin Saha akışındaki izi. Gönderi yalnızca referanstır: kart sevkiyatın güncel durumunu buradan
 * okur, ayrı bir kopya olarak düzenlenmez.
 */
@Entity
@Table(name = "material_field_posts")
class MaterialFieldPost {

    @Id
    private UUID postId;
    private UUID shipmentId;
    private UUID siteId;

    protected MaterialFieldPost() {
    }

    MaterialFieldPost(UUID postId, UUID shipmentId, UUID siteId) {
        this.postId = postId;
        this.shipmentId = shipmentId;
        this.siteId = siteId;
    }
}
