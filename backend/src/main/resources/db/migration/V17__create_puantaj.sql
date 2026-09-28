-- Puantaj (TASARIM.md "Yoklama"): firmanın yoklaması, şantiyeye bağlı değildir. Sayılanlar iki türdür: kişi kişi
-- takip edilen çalışanlar ve ekip olarak takip edilen taşeronlar ("Demirci · Hasan Usta"; ekipte kaç kişi olduğu
-- tutulmaz, o ekip başının işidir). Kişi uygulamadaki bir çalışan olabilir (user_id) ya da uygulaması olmayan,
-- yalnızca adıyla eklenen biri. Listeden çıkarılan kalem silinmez (archived_at): geçmiş günleri puantajda kalır.
create table roster_entries (
    id          uuid primary key,
    company_id  uuid         not null references companies (id),
    kind        varchar(10)  not null check (kind in ('PERSON', 'CREW')),
    user_id     uuid unique references users (id),
    name        varchar(120) not null,
    trade       varchar(60),
    phone       varchar(20),
    archived_at timestamptz,
    created_at  timestamptz  not null,
    check (kind = 'PERSON' or user_id is null)
);
create index roster_entries_company_idx on roster_entries (company_id);

-- Bir kalemin bir günü. İşaretlenmemiş gün yazılmaz: "İşaretlenmedi", "Gelmedi" demek değildir. Mesai yalnızca
-- geldiği güne yazılan saattir; ekip için yalnızca geldi / gelmedi tutulur (servis denetler).
create table puantaj_marks (
    entry_id       uuid          not null references roster_entries (id),
    day            date          not null,
    company_id     uuid          not null references companies (id),
    status         varchar(10)   not null check (status in ('PRESENT', 'HALF_DAY', 'ABSENT', 'LEAVE')),
    overtime_hours numeric(3, 1) check (overtime_hours > 0 and overtime_hours <= 16),
    note           varchar(200),
    marked_by      uuid          not null references users (id),
    marked_at      timestamptz   not null,
    primary key (entry_id, day),
    check (overtime_hours is null or status = 'PRESENT')
);
create index puantaj_marks_company_day_idx on puantaj_marks (company_id, day);
