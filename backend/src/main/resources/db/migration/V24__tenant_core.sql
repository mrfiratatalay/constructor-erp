-- Constructor ERP (MIMARI-SAAS.md): uygulama artık tek firmanın değil, birden çok müteahhit firmasının ürünüdür.
-- Firma (companies) tenant'ın kendisidir: bütün iş verisinin güvenlik sınırı. Veri silinmez; mevcut firma ve
-- kişileri ilk tenant'ın verisi olur. Kalıp: alan önce boş eklenir, doldurulur, doğrulanır, sonra zorunlu yapılır.

-- 1) Firmanın kimliği ve yaşam döngüsü. Logo diskte firmanın klasöründe durur; burada yalnızca var olduğu ve türü
-- tutulur. Silme yoktur: firma askıya alınır ya da arşivlenir.
alter table companies
    add column slug               varchar(60),
    add column status             varchar(12),
    add column phone              varchar(20),
    add column email              varchar(254),
    add column city               varchar(60),
    add column logo_content_type  varchar(40),
    add column logo_updated_at    timestamptz,
    add column setup_completed_at timestamptz,
    add column updated_at         timestamptz;

update companies
set slug               = coalesce(nullif(trim(both '-' from lower(regexp_replace(
        translate(name, 'çğıöşüÇĞİÖŞÜâÂîÎûÛ', 'cgiosuCGIOSUaAiIuU'), '[^A-Za-z0-9]+', '-', 'g'))), ''),
        'firma-' || left(id::text, 8)),
    status             = 'ACTIVE',
    setup_completed_at = created_at,
    updated_at         = created_at;

-- Aynı adı taşıyan iki firma olursa ikincisinin adresi kimliğinin başıyla ayrışır.
update companies c
set slug = c.slug || '-' || left(c.id::text, 6)
where exists (select 1 from companies o where o.slug = c.slug and o.id < c.id);

alter table companies
    alter column slug set not null,
    alter column status set not null,
    alter column updated_at set not null,
    add constraint companies_status_check check (status in ('ACTIVE', 'SUSPENDED', 'ARCHIVED'));
create unique index companies_slug_uniq on companies (slug);

-- 2) Üyelik: kişi ile firma arasındaki bağ. Rol ve "firmada mı" bilgisi kişinin değil üyeliğin özelliğidir; bir kişi
-- ileride birden çok firmada olabilir. Mevcut her kişi bugünkü firmasına bugünkü rolüyle üye olur.
create table company_memberships (
    id         uuid primary key,
    company_id uuid        not null references companies (id),
    user_id    uuid        not null references users (id) on delete cascade,
    role       varchar(20) not null check (role in ('OWNER', 'SITE_LEAD', 'WAREHOUSE', 'WORKER')),
    active     boolean     not null,
    created_at timestamptz not null,
    unique (company_id, user_id)
);
create index company_memberships_user_idx on company_memberships (user_id);

insert into company_memberships (id, company_id, user_id, role, active, created_at)
select gen_random_uuid(), company_id, id, role, active, created_at
from users;

-- 3) Oturum hangi firmada çalışıldığını taşır; giriş linki hangi firmanın patronunca üretildiyse oraya açar.
alter table user_sessions add column company_id uuid references companies (id);
update user_sessions s set company_id = u.company_id from users u where u.id = s.user_id;

alter table invites add column company_id uuid references companies (id);
update invites i set company_id = u.company_id from users u where u.id = i.user_id;

-- 4) Platform rolü firma rolünden ayrıdır: Constructor ERP'yi işleten ekip hiçbir firmaya üye olmak zorunda değildir.
alter table users add column platform_role varchar(20) check (platform_role in ('SUPER_ADMIN'));

-- 5) Doğrulama: aktarımda tek kişi ya da tek oturum kaybolursa migration geri alınır.
do $$
begin
    if (select count(*) from users) <> (select count(*) from company_memberships) then
        raise exception 'Üyelik aktarımı eksik: her kişinin bir üyeliği olmalı';
    end if;
    if exists (select 1 from user_sessions where company_id is null) then
        raise exception 'Oturum aktarımı eksik: her oturumun firması olmalı';
    end if;
end $$;
