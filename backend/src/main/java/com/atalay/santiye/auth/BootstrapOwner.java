package com.atalay.santiye.auth;

import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Boş bir veritabanında ilk firmayı ve patronu oluşturur; veri varsa hiçbir şeye dokunmaz. */
@Component
class BootstrapOwner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BootstrapOwner.class);

    private final BootstrapProperties properties;
    private final CompanyRepository companies;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    BootstrapOwner(BootstrapProperties properties, CompanyRepository companies, UserRepository users,
        PasswordEncoder passwordEncoder, Clock clock) {
        this.properties = properties;
        this.companies = companies;
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!properties.isComplete() || users.count() > 0) {
            return;
        }
        Company company = companies.save(new Company(properties.companyName(), clock.instant()));
        AppUser owner = new AppUser(company.getId(), properties.ownerName(), UserRole.OWNER, clock.instant());
        owner.setPasswordLogin(properties.ownerEmail(), passwordEncoder.encode(properties.ownerPassword()));
        users.save(owner);
        log.info("İlk yönetici oluşturuldu: {}", properties.ownerEmail());
    }
}
