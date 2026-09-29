package com.atalay.santiye.platform;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.PlatformRole;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Hiç süper yönetici yokken ayarlardaki hesabı süper yönetici yapar (yoksa açar). Süper yönetici bir kez varsa
 * dokunmaz: yenileri platform içinden verilir, ayar dosyası kimseyi sonradan yetkilendiremez.
 */
@Component
class PlatformAdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(PlatformAdminBootstrap.class);

    private final PlatformAdminProperties properties;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    PlatformAdminBootstrap(PlatformAdminProperties properties, UserRepository users, PasswordEncoder passwordEncoder,
        Clock clock) {
        this.properties = properties;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!properties.isComplete() || users.existsByPlatformRole(PlatformRole.SUPER_ADMIN)) {
            return;
        }
        AppUser admin = users.findByEmailIgnoreCase(properties.adminEmail())
            .orElseGet(() -> new AppUser(properties.adminName(), clock.instant()));
        if (!admin.canLoginWithPassword()) {
            admin.setPasswordLogin(properties.adminEmail(), passwordEncoder.encode(properties.adminPassword()));
        }
        admin.grantPlatformRole(PlatformRole.SUPER_ADMIN);
        users.save(admin);
        log.info("Platform yöneticisi hazır: {}", properties.adminEmail());
    }
}
