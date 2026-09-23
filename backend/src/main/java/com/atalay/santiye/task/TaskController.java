package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.task.dto.CreateTaskRequest;
import com.atalay.santiye.task.dto.TaskView;
import com.atalay.santiye.task.dto.UpdateTaskRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Görev şantiyesine aittir: şantiyenin altında listelenir ve açılır, kendi adresiyle güncellenir. */
@RestController
@Tag(name = "Tasks")
public class TaskController {

    private final TaskService tasks;

    TaskController(TaskService tasks) {
        this.tasks = tasks;
    }

    @GetMapping("/sites/{siteId}/tasks")
    public List<TaskView> listSiteTasks(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return tasks.listTasks(user, siteId);
    }

    @PostMapping("/sites/{siteId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskView createTask(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @Valid @RequestBody CreateTaskRequest request) {
        return tasks.createTask(user, siteId, request);
    }

    @PutMapping("/tasks/{taskId}")
    public TaskView updateTask(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID taskId,
        @Valid @RequestBody UpdateTaskRequest request) {
        return tasks.updateTask(user, taskId, request);
    }

    @DeleteMapping("/tasks/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID taskId) {
        tasks.deleteTask(user, taskId);
    }
}
