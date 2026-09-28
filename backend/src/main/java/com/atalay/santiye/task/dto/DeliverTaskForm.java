package com.atalay.santiye.task.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/** Teslimin fotoğrafları (multipart): işin bittiğini gösteren 1-4 fotoğraf; yazı gerekmez. */
public record DeliverTaskForm(@NotEmpty List<MultipartFile> photos) {
}
