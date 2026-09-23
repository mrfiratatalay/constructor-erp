package com.atalay.santiye.task;

import com.atalay.santiye.task.dto.TaskPerson;
import com.atalay.santiye.task.dto.TaskView;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/** Görevi kişi adlarıyla birlikte dışarıya verilecek biçime çevirir; adlar tek sorguda toplanır. */
@Component
class TaskViews {

    private final UserRepository users;

    TaskViews(UserRepository users) {
        this.users = users;
    }

    List<TaskView> of(List<Task> tasks) {
        List<UUID> personIds = tasks.stream()
            .flatMap(task -> Stream.of(task.getAssigneeId(), task.getCreatedBy()))
            .filter(Objects::nonNull)
            .distinct()
            .toList();
        Map<UUID, AppUser> people = users.findAllById(personIds).stream()
            .collect(Collectors.toMap(AppUser::getId, Function.identity()));
        return tasks.stream().map(task -> toView(task, people)).toList();
    }

    TaskView of(Task task) {
        return of(List.of(task)).getFirst();
    }

    private static TaskView toView(Task task, Map<UUID, AppUser> people) {
        return new TaskView(task.getId(), task.getSiteId(), task.getTitle(), task.getNote(), task.getStatus(),
            task.getPriority(), task.getDueDate(), person(people, task.getAssigneeId()),
            person(people, task.getCreatedBy()), task.getPostId(), task.getCreatedAt(), task.getCompletedAt());
    }

    private static TaskPerson person(Map<UUID, AppUser> people, UUID id) {
        AppUser user = id == null ? null : people.get(id);
        return user == null ? null : new TaskPerson(user.getId(), user.getFullName());
    }
}
