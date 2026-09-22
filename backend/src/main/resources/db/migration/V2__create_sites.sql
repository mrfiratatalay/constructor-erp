create table sites (
    id         uuid primary key,
    company_id uuid         not null references companies (id),
    name       varchar(120) not null,
    address    varchar(300),
    status     varchar(20)  not null check (status in ('ACTIVE', 'COMPLETED')),
    created_at timestamptz  not null
);
create index sites_company_idx on sites (company_id);

-- Şantiye sorumluları: bir kişi birden çok şantiyeye, bir şantiye birden çok kişiye bakabilir.
create table site_members (
    site_id uuid not null references sites (id) on delete cascade,
    user_id uuid not null references users (id) on delete cascade,
    primary key (site_id, user_id)
);
create index site_members_user_idx on site_members (user_id);
