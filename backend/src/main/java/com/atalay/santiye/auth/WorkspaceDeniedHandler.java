package com.atalay.santiye.auth;

import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.billing.WorkspaceStatus;
import com.atalay.santiye.tenant.WorkspacePaths;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;

/**
 * 403'ün nedenini söyler (RFC 9457 + code). Firmanın çalışma alanı kilitliyse WORKSPACE_LOCKED ve nedeni: arayüz
 * kilit ekranını gösterir. Firmasız hesap firma ucuna gelirse NO_WORKSPACE; geri kalanı yetki eksikliğidir.
 */
class WorkspaceDeniedHandler implements AccessDeniedHandler {

    private record Problem(String code, String title, String detail, String reason) {
    }

    private final WorkspaceAccess access;

    WorkspaceDeniedHandler(WorkspaceAccess access) {
        this.access = access;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException denied)
        throws IOException {
        Problem problem = problemFor(request, currentUser());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"status\":403,\"title\":" + json(problem.title()) + ",\"detail\":"
            + json(problem.detail()) + ",\"code\":" + json(problem.code()) + ",\"reason\":" + json(problem.reason())
            + ",\"instance\":" + json(request.getRequestURI()) + "}");
    }

    private Problem problemFor(HttpServletRequest request, CurrentUser user) {
        if (user != null && WorkspacePaths.isWorkspace(request.getRequestURI())) {
            if (!user.hasWorkspace()) {
                return new Problem("NO_WORKSPACE", "Forbidden", "Bir firmanın çalışma alanında değilsin.", null);
            }
            WorkspaceStatus status = access.statusOf(user.companyId());
            if (!status.open()) {
                return new Problem("WORKSPACE_LOCKED", "Forbidden", status.lockReason().message(),
                    status.lockReason().name());
            }
        }
        return new Problem("FORBIDDEN", "Forbidden", "Bu işlem için yetkin yok.", null);
    }

    private static CurrentUser currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getPrincipal() instanceof CurrentUser user ? user : null;
    }

    private static String json(String value) {
        if (value == null) {
            return "null";
        }
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
