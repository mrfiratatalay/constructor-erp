package com.atalay.santiye.notification;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Optional<Notification> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);
}
