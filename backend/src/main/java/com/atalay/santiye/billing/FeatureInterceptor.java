package com.atalay.santiye.billing;

import com.atalay.santiye.common.error.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/** @RequiresFeature'ı uygular. Firmanın açık modülleri oturum doğrulanırken yetki olarak yazılır (FEATURE_…). */
class FeatureInterceptor implements HandlerInterceptor {

    static final String PREFIX = "FEATURE_";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod method)) {
            return true;
        }
        RequiresFeature required = AnnotatedElementUtils.findMergedAnnotation(method.getMethod(), RequiresFeature.class);
        if (required == null) {
            required = AnnotatedElementUtils.findMergedAnnotation(method.getBeanType(), RequiresFeature.class);
        }
        if (required != null && !granted(PREFIX + required.value())) {
            throw ApiException.forbidden("Bu modül firmanızın paketinde yok.", "FEATURE_NOT_IN_PLAN");
        }
        return true;
    }

    private static boolean granted(String authority) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).anyMatch(authority::equals);
    }
}
