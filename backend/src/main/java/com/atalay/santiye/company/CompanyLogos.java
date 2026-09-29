package com.atalay.santiye.company;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.MediaProperties;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Firma logosu: medya kökünde firmanın kendi klasöründe ({firma}/branding/logo). Yalnızca PNG, JPEG ve WEBP kabul
 * edilir; tür, istemcinin söylediğine değil dosyanın ilk baytlarına bakılarak belirlenir (SVG gibi betik taşıyabilen
 * biçimler reddedilir). Logo gizli değildir: adresi tahmin edilemez kimlik ve sürüm taşır.
 */
@Component
public class CompanyLogos {

    private static final long MAX_BYTES = 2L * 1024 * 1024;
    private static final int HEADER_BYTES = 12;

    private final Path root;
    private final CompanyRepository companies;
    private final Clock clock;

    CompanyLogos(MediaProperties properties, CompanyRepository companies, Clock clock) {
        this.root = properties.root().toAbsolutePath().normalize();
        this.companies = companies;
        this.clock = clock;
    }

    @Transactional
    public Company replace(UUID companyId, MultipartFile file) {
        Company company = companies.findById(companyId).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
        if (file == null || file.isEmpty() || file.getSize() > MAX_BYTES) {
            throw ApiException.badRequest("Logo en fazla 2 MB bir resim olmalı.");
        }
        String type = typeOf(file).orElseThrow(() -> ApiException.badRequest("Logo PNG, JPEG ya da WEBP olmalı."));
        try {
            Files.createDirectories(pathOf(companyId).getParent());
            file.transferTo(pathOf(companyId));
        } catch (IOException error) {
            throw new IllegalStateException("Logo kaydedilemedi", error);
        }
        company.changeLogo(type, clock.instant());
        return company;
    }

    @Transactional
    public void remove(UUID companyId) {
        companies.findById(companyId).ifPresent(company -> company.changeLogo(null, clock.instant()));
    }

    /** Firmanın logosu ve türü; logo yoksa boş. */
    @Transactional(readOnly = true)
    public Optional<StoredLogo> read(UUID companyId) {
        return companies.findById(companyId).filter(company -> company.getLogoContentType() != null)
            .map(company -> new StoredLogo(new FileSystemResource(pathOf(companyId)), company.getLogoContentType()))
            .filter(logo -> logo.resource().exists());
    }

    private Path pathOf(UUID companyId) {
        return root.resolve(companyId.toString()).resolve("branding").resolve("logo");
    }

    private static Optional<String> typeOf(MultipartFile file) {
        try (InputStream in = file.getInputStream()) {
            byte[] head = Arrays.copyOf(in.readNBytes(HEADER_BYTES), HEADER_BYTES);
            return Optional.ofNullable(ImageSignature.detect(head));
        } catch (IOException error) {
            return Optional.empty();
        }
    }

    /** Diskteki logo ve türü. */
    public record StoredLogo(Resource resource, String contentType) {
    }
}
