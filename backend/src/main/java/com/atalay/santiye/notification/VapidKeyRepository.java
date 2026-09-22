package com.atalay.santiye.notification;

import org.springframework.data.jpa.repository.JpaRepository;

interface VapidKeyRepository extends JpaRepository<VapidKeyRecord, Integer> {
}
