package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/** Harekete eklenen belgeler (irsaliye, fatura, teslim tutanağı): PDF, JPG ya da PNG, her biri en çok 10 MB. */
public record DocumentUploadForm(@NotEmpty List<MultipartFile> files) {
}
