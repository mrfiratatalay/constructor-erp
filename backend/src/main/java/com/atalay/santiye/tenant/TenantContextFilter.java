package com.atalay.santiye.tenant;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Firma çalışma alanına gelen istekte, oturumdan çözülmüş firmayı TenantContext'e koyar; istek bitince siler. Firma
 * kimliği istekten (başlık, adres, gövde) okunmaz. Güvenlik zincirine kimlik doğrulamadan sonra eklenir.
 */
public class TenantContextFilter extends OncePerRequestFilter {

    private final Function<Object, UUID> companyOfPrincipal;

    public TenantContextFilter(Function<Object, UUID> companyOfPrincipal) {
        this.companyOfPrincipal = companyOfPrincipal;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        UUID companyId = WorkspacePaths.isWorkspace(request.getRequestURI()) ? currentCompany() : null;
        if (companyId == null) {
            chain.doFilter(request, response);
            return;
        }
        TenantContext.set(companyId);
        try {
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private UUID currentCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? null : companyOfPrincipal.apply(authentication.getPrincipal());
    }
}
