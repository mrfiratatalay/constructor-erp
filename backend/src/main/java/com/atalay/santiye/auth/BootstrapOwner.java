package com.atalay.santiye.auth;

import com.atalay.santiye.billing.SubscriptionService;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.company.CompanySlugs;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.MembershipRepository;
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

/**
 * Hiç firma yokken ilk firmayı, patronunu ve aboneliğini oluşturur; firma varsa hiçbir şeye dokunmaz. Koşul kişi
 * sayısı değil firma sayısıdır: platform yöneticisi (PlatformAdminBootstrap) firmasız bir kişidir.
 */
@Component
class BootstrapOwner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BootstrapOwner.class);
    /** Kendi sunucusuna kuran (ya da geliştiren) kişi ilk yıl kilitle uğraşmasın. */
    private static final int BOOTSTRAP_MONTHS = 12;

    private final BootstrapProperties properties;
    private final CompanyRepository companies;
    private final CompanySlugs slugs;
    private final UserRepository users;
    private final MembershipRepository memberships;
    private final SubscriptionService subscriptions;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    BootstrapOwner(BootstrapProperties properties, CompanyRepository companies, CompanySlugs slugs,
        UserRepository users, MembershipRepository memberships, SubscriptionService subscriptions,
        PasswordEncoder passwordEncoder, Clock clock) {
        this.properties = properties;
        this.companies = companies;
        this.slugs = slugs;
        this.users = users;
        this.memberships = memberships;
        this.subscriptions = subscriptions;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!properties.isComplete() || companies.count() > 0) {
            return;
        }
        String name = properties.companyName();
        Company company = companies.save(new Company(name, slugs.uniqueFor(name), clock.instant()));
        AppUser owner = new AppUser(properties.ownerName(), clock.instant());
        owner.setPasswordLogin(properties.ownerEmail(), passwordEncoder.encode(properties.ownerPassword()));
        users.save(owner);
        memberships.save(new Membership(company.getId(), owner.getId(), UserRole.OWNER, clock.instant()));
        subscriptions.startOnDefaultPlan(company.getId(), BOOTSTRAP_MONTHS, "İlk kurulum");
        log.info("İlk yönetici oluşturuldu: {}", properties.ownerEmail());
    }
}
