package com.atalay.santiye.task;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findBySiteIdOrderByCreatedAt(UUID siteId);

    Optional<Task> findByIdAndCompanyId(UUID id, UUID companyId);
}
