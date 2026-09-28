package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.task.dto.DeliverTaskForm;
import com.atalay.santiye.task.dto.TaskDeliveryView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** İş teslimi: çalışan görevini fotoğrafla teslim eder; sohbetteki kart teslimin durumunu okur. */
@RestController
@Tag(name = "Deliveries")
public class TaskDeliveryController {

    private final TaskDeliveries deliveries;

    TaskDeliveryController(TaskDeliveries deliveries) {
        this.deliveries = deliveries;
    }

    @PostMapping(value = "/tasks/{taskId}/deliveries", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDeliveryView deliverTask(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID taskId,
        @Valid @ModelAttribute DeliverTaskForm form) {
        return deliveries.deliver(user, taskId, form.photos());
    }

    @GetMapping("/deliveries/{deliveryId}")
    public TaskDeliveryView getDelivery(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID deliveryId) {
        return deliveries.view(user, deliveryId);
    }
}
