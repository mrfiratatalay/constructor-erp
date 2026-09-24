-- Şantiyeye davet bağlantısı (WhatsApp'taki "gruba davet bağlantısı" gibi): patron WhatsApp'tan gönderir,
-- açan kişi adını ve numarasını kendisi yazıp katılır. Patron hiç numara yazmaz. Tek kullanımlık ve
-- süreli; token açık saklanmaz (giriş linki gibi özeti tutulur), kimin kullandığı kayıtlı kalır.
create table site_invites (
    id         uuid primary key,
    site_id    uuid        not null references sites (id) on delete cascade,
    created_by uuid        not null references users (id),
    token_hash varchar(64) not null unique,
    created_at timestamptz not null,
    expires_at timestamptz not null,
    used_at    timestamptz,
    used_by    uuid references users (id)
);
create index site_invites_site_idx on site_invites (site_id);

-- Akışta yeni sistem satırı: "Musa davet bağlantısıyla katıldı".
alter table site_events drop constraint site_events_kind_check;
alter table site_events add constraint site_events_kind_check
    check (kind in ('CREATED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'MEMBER_JOINED'));
