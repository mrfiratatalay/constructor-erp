package com.atalay.santiye.account;

import com.atalay.santiye.account.dto.CompanyProfileView;
import com.atalay.santiye.account.dto.UpdateCompanyProfileRequest;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyLogos;
import com.atalay.santiye.company.CompanyProfile;
import com.atalay.santiye.company.CompanyRepository;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/** Firmanın kimliğini patron düzenler: ad, iletişim, logo. Firma her zaman oturumdan gelir. */
@Service
public class AccountProfiles {

    private final CompanyRepository companies;
    private final CompanyLogos logos;
    private final Clock clock;

    AccountProfiles(CompanyRepository companies, CompanyLogos logos, Clock clock) {
        this.companies = companies;
        this.logos = logos;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public CompanyProfileView of(UUID companyId) {
        return viewOf(require(companyId));
    }

    @Transactional
    public CompanyProfileView update(UUID companyId, UpdateCompanyProfileRequest request) {
        Company company = require(companyId);
        company.updateProfile(new CompanyProfile(request.name().trim(), blankToNull(request.phone()),
            blankToNull(request.email()), blankToNull(request.city())), clock.instant());
        return viewOf(company);
    }

    @Transactional
    public CompanyProfileView replaceLogo(UUID companyId, MultipartFile file) {
        return viewOf(logos.replace(companyId, file));
    }

    @Transactional
    public CompanyProfileView removeLogo(UUID companyId) {
        logos.remove(companyId);
        return viewOf(require(companyId));
    }

    private Company require(UUID companyId) {
        return companies.findById(companyId).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
    }

    static CompanyProfileView viewOf(Company company) {
        return new CompanyProfileView(company.getId(), company.getName(), company.getSlug(), company.getPhone(),
            company.getEmail(), company.getCity(), company.getLogoUrl());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
