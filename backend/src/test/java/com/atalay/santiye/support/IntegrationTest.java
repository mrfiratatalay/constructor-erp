package com.atalay.santiye.support;

import com.atalay.santiye.TestcontainersConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

/**
 * Gerçek PostgreSQL (Testcontainers) ve tam güvenlik zinciriyle uçtan uca API testi. local profil: ilk firma ve
 * patronu, platform yöneticisi açılışta kurulur (varsayılan profil olmadığı için açıkça verilir).
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Import(TestcontainersConfiguration.class)
@TestPropertySource(properties = "app.media.root=${java.io.tmpdir}/santiye-test-media")
public @interface IntegrationTest {
}
