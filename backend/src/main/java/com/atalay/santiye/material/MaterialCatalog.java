package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.MaterialRequest;
import com.atalay.santiye.material.dto.MaterialView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Malzeme kartları: ad ve birim. Ayrı bir malzeme ekranı yoktur; kart sevkiyat formunda adı yazılarak açılır.
 * Ad firmada tekildir. Kart silinmez, pasifleşir: geçmiş sevkiyatlarda adı yerinde kalır.
 */
@Service
public class MaterialCatalog {

    private static final String SELECT = "select id, name, unit, active from materials ";

    private final MaterialRepository materials;
    private final JdbcClient jdbc;
    private final Clock clock;

    MaterialCatalog(MaterialRepository materials, JdbcClient jdbc, Clock clock) {
        this.materials = materials;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    /** Önce aktif kartlar, sonra pasifler; her grup adına göre. */
    @Transactional(readOnly = true)
    public List<MaterialView> list(CurrentUser user) {
        return jdbc.sql(SELECT + "where company_id = :company order by active desc, lower(name)")
            .param("company", user.companyId())
            .query(MaterialView.class)
            .list();
    }

    @Transactional
    public MaterialView create(CurrentUser user, MaterialRequest request) {
        Material material = new Material(user.companyId(), clock.instant());
        describe(user.companyId(), material, tidied(request));
        materials.saveAndFlush(material);
        return view(material.getId());
    }

    @Transactional
    public MaterialView update(CurrentUser user, UUID materialId, MaterialRequest request) {
        Material material = materials.findByIdAndCompanyId(materialId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Malzeme bulunamadı."));
        describe(user.companyId(), material, tidied(request));
        materials.flush();
        return view(materialId);
    }

    private MaterialView view(UUID materialId) {
        return jdbc.sql(SELECT + "where id = :id").param("id", materialId).query(MaterialView.class).single();
    }

    private void describe(UUID companyId, Material material, MaterialRequest request) {
        if (materials.nameTaken(companyId, request.name(), material.getId())) {
            throw ApiException.conflict("Bu adla bir malzeme zaten var: " + request.name() + ".");
        }
        material.describe(request);
    }

    private static MaterialRequest tidied(MaterialRequest request) {
        return new MaterialRequest(tidy(request.name()), tidy(request.unit()), request.active());
    }
}
