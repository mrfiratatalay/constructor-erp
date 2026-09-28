package com.atalay.santiye.material;

import com.atalay.santiye.media.MediaProperties;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Hareket belgelerinin diskteki yeri: medya kökünün altında {materials}/{firma}/{belge}. Kullanıcının dosya adı hiçbir
 * yolda kullanılmaz. Buluta geçerken yalnızca bu sınıf değişir.
 */
@Component
class MaterialFiles {

    private final Path root;

    MaterialFiles(MediaProperties properties) {
        this.root = properties.root().toAbsolutePath().normalize().resolve("materials");
    }

    void save(MaterialDocument document, MultipartFile file) throws IOException {
        Path target = pathOf(document);
        Files.createDirectories(target.getParent());
        file.transferTo(target);
    }

    Resource resourceOf(MaterialDocument document) {
        return new FileSystemResource(pathOf(document));
    }

    private Path pathOf(MaterialDocument document) {
        return root.resolve(document.getCompanyId().toString()).resolve(document.getId().toString());
    }
}
