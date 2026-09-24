-- Şantiye = WhatsApp grubu (TASARIM.md). Bu sürümün şema değişiklikleri tek yerde.

-- Şantiye fotoğrafı (grup fotoğrafı) bir gönderiye ait değildir: medya artık gönderisiz de durabilir.
-- Belge (PDF) dönüştürülmez; ekranda adıyla görünür. Ad yalnızca gösterilir, hiçbir dosya yolunda kullanılmaz.
alter table media alter column post_id drop not null;
alter table media add column file_name varchar(200);
alter table media drop constraint media_kind_check;
alter table media add constraint media_kind_check check (kind in ('PHOTO', 'VIDEO', 'AUDIO', 'DOCUMENT'));

alter table sites add column photo_media_id uuid references media (id) on delete set null;

-- Yanıtla (alıntı), İlet ve mesaj sabitleme. Sabit mesaj kaldırılana kadar durur; şantiye başına en fazla üç.
alter table posts
    add column reply_to_id uuid references posts (id),
    add column forwarded   boolean not null default false,
    add column pinned_at   timestamptz,
    add column pinned_by   uuid references users (id);
create index posts_pinned_idx on posts (site_id, pinned_at desc) where pinned_at is not null;

-- Şantiye sabitleme kişiye özeldir (WhatsApp'ta sohbet sabitlemek gibi); kişi başına en fazla üç.
create table site_pins (
    user_id   uuid        not null references users (id) on delete cascade,
    site_id   uuid        not null references sites (id) on delete cascade,
    pinned_at timestamptz not null,
    primary key (user_id, site_id)
);

-- Akıştaki sistem satırları: "Patron şantiyeyi kurdu", "Patron, Musa'yı ekledi".
create table site_events (
    id         uuid primary key,
    site_id    uuid        not null references sites (id) on delete cascade,
    kind       varchar(20) not null check (kind in ('CREATED', 'MEMBER_ADDED', 'MEMBER_REMOVED')),
    actor_id   uuid references users (id),
    subject_id uuid references users (id),
    created_at timestamptz not null
);
create index site_events_site_idx on site_events (site_id, created_at);

-- Eski şantiyelerin geçmişi: kuruluşu ve bugünkü katılımcıları olay olarak yazılır. Kimin yaptığı
-- bilinmediği için actor boş kalır; ekranda "Şantiye kuruldu", "Musa eklendi" diye okunur.
insert into site_events (id, site_id, kind, actor_id, subject_id, created_at)
select gen_random_uuid(), s.id, 'CREATED', null, null, s.created_at
from sites s;

insert into site_events (id, site_id, kind, actor_id, subject_id, created_at)
select gen_random_uuid(), m.site_id, 'MEMBER_ADDED', null, m.user_id, s.created_at
from site_members m
         join sites s on s.id = m.site_id;
