package com.atalay.santiye.account;

import com.atalay.santiye.account.dto.CompanyProfileView;
import com.atalay.santiye.account.dto.CompanySubscriptionView;
import com.atalay.santiye.account.dto.UpdateCompanyProfileRequest;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Firma hesabı (çalışma alanı içinde): kimliği herkes görür, patron düzenler; abonelik özetini yalnızca patron görür.
 * Firma her zaman oturumdan gelir; adreste firma kimliği yoktur.
 */
@RestController
@RequestMapping("/company")
@Tag(name = "Account")
public class AccountController {

    private final AccountProfiles profiles;
    private final AccountSubscriptions subscriptions;

    AccountController(AccountProfiles profiles, AccountSubscriptions subscriptions) {
        this.profiles = profiles;
        this.subscriptions = subscriptions;
    }

    @GetMapping("/profile")
    public CompanyProfileView getCompanyProfile(@AuthenticationPrincipal CurrentUser user) {
        return profiles.of(user.companyId());
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('OWNER')")
    public CompanyProfileView updateCompanyProfile(@AuthenticationPrincipal CurrentUser owner,
        @Valid @RequestBody UpdateCompanyProfileRequest request) {
        return profiles.update(owner.companyId(), request);
    }

    @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('OWNER')")
    public CompanyProfileView uploadCompanyLogo(@AuthenticationPrincipal CurrentUser owner,
        @RequestPart("file") MultipartFile file) {
        return profiles.replaceLogo(owner.companyId(), file);
    }

    @DeleteMapping("/logo")
    @PreAuthorize("hasRole('OWNER')")
    public CompanyProfileView removeCompanyLogo(@AuthenticationPrincipal CurrentUser owner) {
        return profiles.removeLogo(owner.companyId());
    }

    @GetMapping("/subscription")
    @PreAuthorize("hasRole('OWNER')")
    public CompanySubscriptionView getCompanySubscription(@AuthenticationPrincipal CurrentUser owner) {
        return subscriptions.of(owner.companyId());
    }
}
