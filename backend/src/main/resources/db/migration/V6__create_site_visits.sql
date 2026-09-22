-- Kişinin bir şantiyeye en son ne zaman baktığı. Ana ekrandaki okunmadı sayısı ve şantiye
-- sayfasındaki "buradan yukarısı yeni" çizgisi buradan hesaplanır.
create table site_visits (
    user_id uuid        not null references users (id) on delete cascade,
    site_id uuid        not null references sites (id) on delete cascade,
    seen_at timestamptz not null,
    primary key (user_id, site_id)
);
