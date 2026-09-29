package com.atalay.santiye.billing;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findByCompanyIdOrderByStartsOnDesc(UUID companyId);
}
