-- Platform yönetimi (Constructor ERP ekibi): kurulum davetleri, yapılan kritik işlemlerin izi ve satış talepleri.
-- Hepsi platform tablosudur; firma isteği onları okumaz.

-- Satın alan firmaya gönderilen kurulum linki. Token açık saklanmaz (oturum gibi SHA-256 özeti), süreli ve tek
-- kullanımlıktır; yenisi üretilince bekleyen eski link iptal olur.
create table tenant_onboarding_invites (
    id         uuid primary key,
    company_id uuid        not null references companies (id),
    token_hash varchar(64) not null unique,
    status     varchar(10) not null check (status in ('PENDING', 'USED', 'REVOKED')),
    expires_at timestamptz not null,
    used_at    timestamptz,
    used_by    uuid references users (id),
    revoked_at timestamptz,
    created_by uuid references users (id),
    created_at timestamptz not null
);
create index tenant_onboarding_invites_company_idx on tenant_onboarding_invites (company_id, created_at desc);

-- Platformda yapılan kritik işlemler: firma açıldı, abonelik uzatıldı, ödeme alındı, firma askıya alındı…
-- Silinmez, değişmez. details: işlemin ayrıntısı (eski/yeni değerler).
create table platform_audit_logs (
    id         uuid primary key,
    actor_id   uuid references users (id),
    action     varchar(40)  not null,
    company_id uuid references companies (id),
    summary    varchar(300) not null,
    details    jsonb,
    created_at timestamptz  not null
);
create index platform_audit_logs_created_idx on platform_audit_logs (created_at desc);
create index platform_audit_logs_company_idx on platform_audit_logs (company_id, created_at desc);

-- Tanıtım sitesindeki başvuru formu. POS olmadığı için satış buradan başlar: ekip firmayı arar, ödeme elden ya da
-- havaleyle alınır, firma (tenant) açılır ve talep ona bağlanır.
create table sales_requests (
    id           uuid primary key,
    company_name varchar(120)  not null,
    contact_name varchar(120)  not null,
    phone        varchar(20)   not null,
    email        varchar(254),
    city         varchar(60),
    site_count   integer check (site_count >= 0),
    plan_id      uuid references plans (id),
    message      varchar(1000),
    status       varchar(12)   not null check (status in ('NEW', 'CONTACTED', 'WON', 'LOST')),
    notes        varchar(1000),
    company_id   uuid references companies (id),
    created_at   timestamptz   not null,
    updated_at   timestamptz   not null
);
create index sales_requests_created_idx on sales_requests (created_at desc);
