package com.atalay.santiye.lead;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface SalesRequestRepository extends JpaRepository<SalesRequest, UUID> {

    long countByStatus(SalesRequestStatus status);
}
