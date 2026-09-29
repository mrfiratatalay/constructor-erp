-- Malzeme modülü. Malzeme kartı malzemeyi tanımlar, hareket malzemenin ne yaptığını anlatır; stok bir kolon değildir,
-- hareketlerden hesaplanır (kullanıcı stoğu elle yazmaz). Geçmiş hareket silinmez: iptal edilir, izi kalır.

-- Malzeme kartı: tek ana birimle izlenir (birim dönüşümü yok). Eski malzeme silinmez, pasifleşir.
create table materials (
    id          uuid primary key,
    company_id  uuid           not null references companies (id),
    name        varchar(120)   not null,
    code        varchar(40),
    category    varchar(60)    not null,
    unit        varchar(20)    not null,
    min_stock   numeric(14, 3) check (min_stock >= 0),
    description varchar(500),
    active      boolean        not null,
    created_at  timestamptz    not null
);
create unique index materials_company_name_idx on materials (company_id, lower(name));
create unique index materials_company_code_idx on materials (company_id, lower(code)) where code is not null;

-- Stoğun durduğu yer: depo (adıyla) ya da şantiye (adı şantiyeden gelir). Şantiye lokasyonu şantiye okunurken
-- kendiliğinden açılır; depo lokasyonlarını depo sorumlusu ekler.
create table stock_locations (
    id         uuid primary key,
    company_id uuid         not null references companies (id),
    kind       varchar(10)  not null check (kind in ('DEPOT', 'SITE')),
    site_id    uuid unique references sites (id),
    name       varchar(120),
    created_at timestamptz  not null,
    check ((kind = 'SITE') = (site_id is not null)),
    check (kind = 'SITE' or name is not null)
);
create index stock_locations_company_idx on stock_locations (company_id);

-- Şirket dışındaki taraf: tedarikçi, müteahhit, firma ya da kişi. Hareket formunda adı yazılınca kendiliğinden açılır.
create table material_parties (
    id         uuid primary key,
    company_id uuid         not null references companies (id),
    name       varchar(120) not null,
    created_at timestamptz  not null
);
create unique index material_parties_company_name_idx on material_parties (company_id, lower(name));

-- Hareket numarası ("MH-000123") kimlikten ayrı, okunur ve değişmez.
create sequence material_movement_number_seq;

-- Malzeme hareketi. Kimliği istemci üretir: aynı istek tekrar gelirse ikinci kayıt açılmaz. Türü ne olduğunu
-- (Transfer), durumu nerede olduğunu (Yolda) söyler. Miktar ondalıklıdır, float değil.
create table material_movements (
    id                   uuid primary key,
    number               bigint         not null unique default nextval('material_movement_number_seq'),
    company_id           uuid           not null references companies (id),
    material_id          uuid           not null references materials (id),
    type                 varchar(12)    not null check (type in
        ('INBOUND', 'TO_SITE', 'USED', 'TRANSFER', 'OUTBOUND', 'RETURN', 'ADJUSTMENT')),
    status               varchar(20)    not null check (status in ('PENDING_CHECK', 'IN_TRANSIT', 'DELIVERED',
        'COMPLETED', 'AWAITING_RETURN', 'PARTIALLY_RETURNED', 'RETURNED', 'CANCELLED')),
    quantity             numeric(14, 3) not null check (quantity > 0),
    source_id            uuid references stock_locations (id),
    destination_id       uuid references stock_locations (id),
    party_id             uuid references material_parties (id),
    purpose              varchar(10) check (purpose in ('SOLD', 'LOANED', 'SUPPORT')),
    return_of_id         uuid references material_movements (id),
    day                  date           not null,
    expected_return_date date,
    return_note          varchar(300),
    usage_area           varchar(120),
    reason               varchar(120),
    description          varchar(500),
    system_quantity      numeric(14, 3),
    counted_quantity     numeric(14, 3),
    created_by           uuid           not null references users (id),
    created_at           timestamptz    not null,
    check (source_id is null or destination_id is null or source_id <> destination_id)
);
create index material_movements_company_day_idx on material_movements (company_id, day desc, number desc);
create index material_movements_material_idx on material_movements (material_id);
create index material_movements_return_of_idx on material_movements (return_of_id) where return_of_id is not null;

-- Hareketin belgeleri: irsaliye, fatura fotoğrafı, teslim tutanağı (PDF, JPG, PNG).
create table material_documents (
    id           uuid primary key,
    movement_id  uuid         not null references material_movements (id),
    company_id   uuid         not null references companies (id),
    file_name    varchar(200) not null,
    content_type varchar(100) not null,
    size_bytes   bigint       not null,
    created_by   uuid         not null references users (id),
    created_at   timestamptz  not null
);
create index material_documents_movement_idx on material_documents (movement_id);

-- Hareketin geçmişi (audit): kim, ne zaman oluşturdu, teslim aldı, düzeltti, iptal etti.
create table material_movement_events (
    id          uuid primary key,
    movement_id uuid         not null references material_movements (id),
    kind        varchar(20)  not null check (kind in
        ('CREATED', 'DELIVERED', 'UPDATED', 'CANCELLED', 'RETURN_ADDED', 'DOCUMENT_ADDED')),
    actor_id    uuid         not null references users (id),
    note        varchar(300),
    created_at  timestamptz  not null
);
create index material_movement_events_movement_idx on material_movement_events (movement_id, created_at);

-- Şantiyenin Saha akışına yansıyan hareket: gönderi yalnızca referanstır, verinin sahibi hareketin kendisidir.
-- Hareket iptal edilince Saha kartı güncel durumu buradan okur.
create table material_field_posts (
    post_id     uuid primary key references posts (id),
    movement_id uuid not null references material_movements (id),
    site_id     uuid not null references sites (id)
);
create index material_field_posts_site_idx on material_field_posts (site_id);
create index material_field_posts_movement_idx on material_field_posts (movement_id);
