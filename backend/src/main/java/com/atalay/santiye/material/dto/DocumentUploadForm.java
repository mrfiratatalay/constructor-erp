package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 * Harekete eklenen belgeler (irsaliye, fatura, teslim tutanağı): PDF, JPG ya da PNG, her biri en çok 10 MB; bir
 * seferde en çok 10 belge (gönderideki dosya sınırıyla aynı).
 */
public record DocumentUploadForm(@NotEmpty @Size(max = 10) List<MultipartFile> files) {
}
