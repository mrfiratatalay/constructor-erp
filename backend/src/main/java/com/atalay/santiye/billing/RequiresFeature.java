package com.atalay.santiye.billing;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Uç (ya da controller'ın bütün uçları) firmanın paketinde bu modül açıksa çalışır; değilse 403 ve
 * code=FEATURE_NOT_IN_PLAN döner. Anahtarlar: {@link Features}.
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresFeature {

    String value();
}
