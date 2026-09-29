package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

/**
 * Hareketin şantiyenin Saha akışındaki izi. Gönderi yalnızca referanstır: kart hareketin güncel durumunu buradan
 * okur, ayrı bir kopya olarak düzenlenmez.
 */
@Entity
@Table(name = "material_field_posts")
class MaterialFieldPost {

    @Id
    private UUID postId;
    private UUID movementId;
    private UUID siteId;

    protected MaterialFieldPost() {
    }

    MaterialFieldPost(UUID postId, UUID movementId, UUID siteId) {
        this.postId = postId;
        this.movementId = movementId;
        this.siteId = siteId;
    }
}
