-- Firma: her müşteri firma yalnızca kendi verisini görür (çok kiracılı yapı).
create table companies (
    id         uuid primary key,
    name       varchar(120) not null,
    created_at timestamptz  not null
);

create table users (
    id            uuid primary key,
    company_id    uuid         not null references companies (id),
    full_name     varchar(120) not null,
    email         varchar(254),
    phone         varchar(20),
    password_hash varchar(100),
    role          varchar(20)  not null check (role in ('OWNER', 'SITE_LEAD')),
    active        boolean      not null,
    created_at    timestamptz  not null
);
create index users_company_idx on users (company_id);
create unique index users_email_uniq on users (lower(email));

-- Oturum ve davet token'larının kendisi değil, SHA-256 özeti saklanır:
-- veritabanı sızsa bile bu değerlerle giriş yapılamaz.
create table user_sessions (
    id           uuid primary key,
    user_id      uuid        not null references users (id) on delete cascade,
    token_hash   varchar(64) not null unique,
    created_at   timestamptz not null,
    last_seen_at timestamptz not null,
    expires_at   timestamptz not null,
    user_agent   varchar(300)
);
create index user_sessions_user_idx on user_sessions (user_id);

create table invites (
    id         uuid primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    token_hash varchar(64) not null unique,
    created_at timestamptz not null,
    expires_at timestamptz not null,
    used_at    timestamptz
);
create index invites_user_idx on invites (user_id);
