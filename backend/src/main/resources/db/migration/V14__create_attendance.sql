-- Günlük personel yoklaması. Sohbete mesaj olarak gitmez, ayrı modülde saklanır (TASARIM.md "Yoklama").

-- Şantiyenin personeli (işçi, usta). Uygulama kullanıcısı değildir: girişi, rolü, daveti yoktur.
create table site_workers (
    id         uuid primary key,
    company_id uuid         not null references companies (id),
    site_id    uuid         not null references sites (id),
    full_name  varchar(120) not null,
    trade      varchar(80),
    created_by uuid         not null references users (id),
    created_at timestamptz  not null
);
create index site_workers_site_idx on site_workers (site_id);

-- Bir şantiyenin bir günlük yoklaması. Aynı gün ikinci kez alınmaz; yanlışlık düzenlenerek düzeltilir.
create table attendances (
    id         uuid primary key,
    company_id uuid        not null references companies (id),
    site_id    uuid        not null references sites (id),
    day        date        not null,
    taken_by   uuid        not null references users (id),
    created_at timestamptz not null,
    updated_by uuid        not null references users (id),
    updated_at timestamptz not null,
    unique (site_id, day)
);

-- O gün kimin geldiği. Günün fotoğrafıdır: sonradan eklenen personel eski günlerde görünmez.
-- İzinli ayrı bir durumdur (EXCUSED); nedeni yalnızca "gelmedi"de vardır ve orada zorunludur.
create table attendance_entries (
    attendance_id uuid        not null references attendances (id) on delete cascade,
    worker_id     uuid        not null references site_workers (id),
    status        varchar(10) not null check (status in ('PRESENT', 'ABSENT', 'EXCUSED')),
    reason        varchar(10) check (reason in ('SICK', 'UNEXCUSED', 'OTHER')),
    note          varchar(500),
    primary key (attendance_id, worker_id),
    check ((status = 'ABSENT') = (reason is not null))
);
create index attendance_entries_worker_idx on attendance_entries (worker_id);
