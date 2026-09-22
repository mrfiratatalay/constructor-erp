package com.atalay.santiye.common.web;

import io.swagger.v3.core.converter.AnnotatedType;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import jakarta.annotation.Nullable;
import java.util.Arrays;
import java.util.Map;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.customizers.PropertyCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * API dokümanı; frontend tipleri (Orval) buradan üretilir.
 * Kural: her alan zorunludur, @Nullable işaretlenmedikçe. Böylece frontend'de her alan
 * "ya yoksa?" kontrolü istemez; gerçekten boş gelebilenler açıkça işaretlenir.
 */
@Configuration
public class OpenApiConfig {

    private static final String OPTIONAL_MARK = "x-optional";

    @Bean
    OpenAPI openApi() {
        return new OpenAPI().info(new Info().title("Kızılkan Şantiye API").version("1.0"));
    }

    @Bean
    PropertyCustomizer nullableMarker() {
        return (property, type) -> {
            if (isNullable(type)) {
                property.addExtension(OPTIONAL_MARK, true);
            }
            return property;
        };
    }

    @Bean
    OpenApiCustomizer requiredUnlessNullable() {
        return openApi -> {
            if (openApi.getComponents() != null && openApi.getComponents().getSchemas() != null) {
                openApi.getComponents().getSchemas().values().forEach(OpenApiConfig::markRequired);
            }
        };
    }

    private static void markRequired(Schema<?> schema) {
        Map<String, Schema> properties = schema.getProperties();
        if (properties == null) {
            return;
        }
        properties.forEach((name, property) -> {
            Map<String, Object> extensions = property.getExtensions();
            if (extensions != null && extensions.remove(OPTIONAL_MARK) != null) {
                return;
            }
            if (schema.getRequired() == null || !schema.getRequired().contains(name)) {
                schema.addRequiredItem(name);
            }
        });
    }

    private static boolean isNullable(AnnotatedType type) {
        return type.getCtxAnnotations() != null
            && Arrays.stream(type.getCtxAnnotations()).anyMatch(Nullable.class::isInstance);
    }
}
