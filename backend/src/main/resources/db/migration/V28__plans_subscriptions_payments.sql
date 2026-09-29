-- Abonelik (MIMARI-SAAS.md Karar 6-7). Ödeme altyapısı (POS) yok; ödeme elden ya da havaleyle alınır ve platform
-- yönetiminden kaydedilir. Bunlar platform tablolarıdır: firma isteği onları firma filtresiyle okumaz.

-- Modül: planın açıp kapattığı iş alanı. Anahtar kodda sabittir (@RequiresFeature, arayüzde meta.feature); adı ve
-- açıklaması burada. Yeni modül yeni bir satırdır, tabloya kolon eklenmez. Şantiyeler (sohbet, saha) ürünün
-- omurgasıdır, plana bağlı değildir.
create table features (
    key         varchar(40) primary key,
    name        varchar(80)  not null,
    description varchar(300) not null,
    sort_order  integer      not null
);

insert into features (key, name, description, sort_order)
values ('tasks', 'Görevler', 'Şantiyede iş takibi: kim, neyi, ne zamana kadar yapacak.', 10),
       ('attendance', 'Yoklama ve puantaj', 'Günlük yoklama, aylık puantaj cetveli ve Excel dökümü.', 20),
       ('materials', 'Malzeme ve sevkiyat', 'Depo ve şantiyeler arası sevkiyat defteri, irsaliye belgeleri, stok.', 30),
       ('production', 'İlerleme takibi', 'Taşeron iş kalemleri, günlük imalat girişleri ve ilerleme raporu.', 40);

-- Paket. Fiyatı boş olan paket teklifle satılır. Kullanıcı ve şantiye sınırı boşsa sınırsızdır.
create table plans (
    id            uuid primary key,
    code          varchar(30)    not null unique,
    name          varchar(60)    not null,
    tagline       varchar(160),
    monthly_price numeric(12, 2) check (monthly_price >= 0),
    currency      varchar(3)     not null,
    max_users     integer check (max_users > 0),
    max_sites     integer check (max_sites > 0),
    highlighted   boolean        not null,
    visible       boolean        not null,
    status        varchar(10)    not null check (status in ('ACTIVE', 'ARCHIVED')),
    sort_order    integer        not null,
    created_at    timestamptz    not null,
    updated_at    timestamptz    not null
);

-- Paketin açtığı modüller. limit_value modüle özel sınır içindir (ileride: aylık sevkiyat sayısı gibi).
create table plan_features (
    plan_id     uuid        not null references plans (id),
    feature_key varchar(40) not null references features (key),
    enabled     boolean     not null,
    limit_value integer,
    primary key (plan_id, feature_key)
);

insert into plans (id, code, name, tagline, monthly_price, currency, max_users, max_sites, highlighted, visible, status,
                   sort_order, created_at, updated_at)
values (gen_random_uuid(), 'starter', 'Starter', 'Küçük ekipler için: sahadan haber, görev ve yoklama.', 2490, 'TRY',
        15, 3, false, true, 'ACTIVE', 10, now(), now()),
       (gen_random_uuid(), 'professional', 'Professional', 'Mevcut bütün ERP modülleri dahil.', 4990, 'TRY',
        null, null, true, true, 'ACTIVE', 20, now(), now()),
       (gen_random_uuid(), 'enterprise', 'Enterprise', 'Çok şantiyeli firmalar için özel kurulum, eğitim ve destek.',
        null, 'TRY', null, null, false, true, 'ACTIVE', 30, now(), now());

insert into plan_features (plan_id, feature_key, enabled, limit_value)
select p.id, f.key, p.code <> 'starter' or f.key in ('tasks', 'attendance'), null
from plans p
         cross join features f;

-- Abonelik dönemi. Her başlatma ya da uzatma yeni bir dönemdir; o dönemin aylık fiyatı price_snapshot'ta donar:
-- paketin fiyatı sonradan değişse de geçmiş bozulmaz. "Süresi doldu" saklanmaz, bitiş tarihinden hesaplanır.
create table subscriptions (
    id             uuid primary key,
    company_id     uuid           not null references companies (id),
    plan_id        uuid           not null references plans (id),
    status         varchar(12)    not null check (status in ('ACTIVE', 'SUSPENDED', 'CANCELLED')),
    starts_on      date           not null,
    ends_on        date           not null,
    price_snapshot numeric(12, 2) check (price_snapshot >= 0),
    currency       varchar(3)     not null,
    note           varchar(300),
    created_by     uuid references users (id),
    created_at     timestamptz    not null,
    updated_at     timestamptz    not null,
    check (ends_on >= starts_on)
);
create index subscriptions_company_idx on subscriptions (company_id, ends_on desc);
create index subscriptions_ends_on_idx on subscriptions (ends_on) where status = 'ACTIVE';

-- Alınan ödeme. POS olmadığı için yalnızca elden, havale ya da başka bir yolla alınan para kaydedilir.
create table payments (
    id              uuid primary key,
    company_id      uuid           not null references companies (id),
    subscription_id uuid references subscriptions (id),
    amount          numeric(12, 2) not null check (amount > 0),
    currency        varchar(3)     not null,
    method          varchar(15)    not null check (method in ('CASH', 'BANK_TRANSFER', 'OTHER')),
    paid_on         date           not null,
    description     varchar(300),
    created_by      uuid references users (id),
    created_at      timestamptz    not null
);
create index payments_company_idx on payments (company_id, paid_on desc);
create index payments_paid_on_idx on payments (paid_on);

-- Mevcut firmalar (Kızılkan) kilitlenmeden geçer: Professional paketinde, bugünden bir aylık ilk dönem. Sonrasını
-- platform yönetimi ödemeyi kaydedip uzatır.
insert into subscriptions (id, company_id, plan_id, status, starts_on, ends_on, price_snapshot, currency, note,
                           created_by, created_at, updated_at)
select gen_random_uuid(), c.id, p.id, 'ACTIVE', c.created_at::date, (current_date + interval '1 month')::date,
       p.monthly_price, p.currency, 'Constructor ERP geçişi: ilk dönem', null, now(), now()
from companies c
         join plans p on p.code = 'professional';
