-- İmalat (TASARIM.md "İmalat"): şantiyede bir taşeronun ya da ekibin yaptığı iş kalemi ve günlük girişleri.
-- Gerçekleşen, kalan, yüzde ve durum saklanmaz, girişlerden hesaplanır: kaynak tektir. Taşeron puantajın ekibidir
-- (roster_entries, kind CREW): firmada tek taşeron listesi olur. Birim serbest yazıdır ("ton", "m²", "adet").
create table production_items (
    id             uuid primary key,
    company_id     uuid           not null references companies (id),
    site_id        uuid           not null references sites (id),
    trade          varchar(60)    not null,
    title          varchar(120),
    crew_id        uuid references roster_entries (id),
    total_quantity numeric(14, 3) not null check (total_quantity > 0),
    unit           varchar(12)    not null,
    start_date     date,
    planned_end    date,
    note           varchar(500),
    created_by     uuid           not null references users (id),
    created_at     timestamptz    not null,
    deleted_at     timestamptz,
    check (planned_end is null or start_date is null or planned_end >= start_date)
);
create index production_items_site_idx on production_items (site_id) where deleted_at is null;

-- Günün girişi: "bugün +3,5 ton". Aynı güne birden çok giriş olabilir (sabah +2, akşam +1,5); 0 da girilebilir
-- (yağmur: çalışma yapılmadı). Silinen giriş hesaba katılmaz, kaydı kalır. post_id: Saha'ya yansıtıldıysa gönderisi.
create table production_entries (
    id           uuid primary key,
    item_id      uuid           not null references production_items (id),
    company_id   uuid           not null references companies (id),
    site_id      uuid           not null references sites (id),
    day          date           not null,
    quantity     numeric(14, 3) not null check (quantity >= 0),
    worker_count integer check (worker_count between 1 and 999),
    note         varchar(500),
    post_id      uuid references posts (id),
    created_by   uuid           not null references users (id),
    created_at   timestamptz    not null,
    deleted_at   timestamptz
);
create index production_entries_item_idx on production_entries (item_id, day) where deleted_at is null;
create index production_entries_site_idx on production_entries (site_id, created_at) where deleted_at is null;

-- Girişin fotoğrafı ve belgesi. Saha'ya yansıtılmadıysa gönderisizdir (post_id boş), yalnızca imalatı görenler
-- görür; yansıtıldıysa Saha gönderisinde de görünür. Saha gönderisi silinirse dosya girişte kalır.
alter table media add column production_entry_id uuid references production_entries (id);
create index media_production_entry_idx on media (production_entry_id) where production_entry_id is not null;
