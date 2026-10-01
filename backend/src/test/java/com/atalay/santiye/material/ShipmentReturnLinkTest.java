package com.atalay.santiye.material;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TenantTestSupport;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** İade kaydı yalnızca aynı firmanın dışarı verilen bir sevkiyatına bağlanır (veritabanı FK'si firmaya bakmaz). */
@IntegrationTest
class ShipmentReturnLinkTest extends TenantTestSupport {

    @Test
    void aReturnCannotPointAtAnotherCompanysShipment() {
        Cookie other = createTenantOwnedBy(uniqueEmail(), "Komsu-Firma-42").owner();
        String theirs = outbound(other);
        Cookie owner = loginAsOwner();

        assertThat(returnOf(owner, theirs)).hasStatus(404);
    }

    @Test
    void aReturnPointsOnlyAtSomethingThatWentOut() {
        Cookie owner = loginAsOwner();
        String delivery = shipmentId(shipment(owner,
            "\"destinationId\": \"%s\", \"partyName\": \"Tedarikçi\", \"expectsReturn\": false".formatted(depot(owner))));

        assertThat(returnOf(owner, delivery)).hasStatus(400);
        assertThat(returnOf(owner, outbound(owner))).hasStatus(201);
    }

    private String outbound(Cookie session) {
        return shipmentId(shipment(session, "\"sourceId\": \"%s\", \"partyName\": \"Komşu Firma\", \"expectsReturn\": true"
            .formatted(depot(session))));
    }

    private MvcTestResult returnOf(Cookie session, String shipmentId) {
        return shipment(session, ("\"destinationId\": \"%s\", \"partyName\": \"Komşu Firma\", \"returnOfId\": \"%s\", "
            + "\"expectsReturn\": false").formatted(depot(session), shipmentId));
    }

    private MvcTestResult shipment(Cookie session, String route) {
        String body = "{\"id\": \"%s\", %s, \"lines\": [{\"materialId\": \"%s\", \"quantity\": 5}]}"
            .formatted(UUID.randomUUID(), route, material(session));
        return postJson("/api/shipments", session, body);
    }

    private static String shipmentId(MvcTestResult created) {
        assertThat(created).as(contentOf(created)).hasStatus(201);
        return read(contentOf(created), "$.row.id");
    }

    private String depot(Cookie session) {
        List<String> depots = JsonPath.read(contentOf(get("/api/stock-locations", session)), "$[?(@.kind == 'DEPOT')].id");
        return depots.getFirst();
    }

    private String material(Cookie session) {
        String body = "{\"name\": \"Çimento %s\", \"unit\": \"Torba\", \"active\": true}".formatted(UUID.randomUUID());
        return read(contentOf(postJson("/api/materials", session, body)), "$.id");
    }
}
