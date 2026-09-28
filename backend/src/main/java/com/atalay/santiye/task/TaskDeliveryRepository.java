package com.atalay.santiye.task;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface TaskDeliveryRepository extends JpaRepository<TaskDelivery, UUID> {

    Optional<TaskDelivery> findByIdAndCompanyId(UUID id, UUID companyId);

    /** Görevin en son teslimi: yeniden teslim düğmesi yalnızca onun kartında durur. */
    Optional<TaskDelivery> findFirstByTaskIdOrderByDeliveredAtDesc(UUID taskId);
}
