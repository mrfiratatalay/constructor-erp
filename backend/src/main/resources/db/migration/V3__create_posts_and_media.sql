-- Saha gönderisi. Kimliği telefon üretir: internet kopup aynı gönderi tekrar yollanırsa çift kayıt oluşmaz.
create table posts (
    id         uuid primary key,
    company_id uuid        not null references companies (id),
    site_id    uuid        not null references sites (id),
    author_id  uuid        not null references users (id),
    body       text,
    is_issue   boolean     not null,
    created_at timestamptz not null
);
-- Akış en yeniden eskiye, (zaman, kimlik) çiftiyle sayfalanır.
create index posts_site_feed_idx on posts (site_id, created_at desc, id desc);

-- Gönderinin fotoğraf, video ve sesleri. site_id, erişim kontrolü gönderiye gitmeden yapılabilsin diye burada da tutulur.
create table media (
    id               uuid primary key,
    post_id          uuid         not null references posts (id) on delete cascade,
    site_id          uuid         not null references sites (id),
    company_id       uuid         not null references companies (id),
    kind             varchar(10)  not null check (kind in ('PHOTO', 'VIDEO', 'AUDIO')),
    status           varchar(12)  not null check (status in ('PROCESSING', 'READY', 'FAILED')),
    position         integer      not null,
    original_type    varchar(100) not null,
    size_bytes       bigint       not null,
    duration_seconds double precision,
    created_at       timestamptz  not null
);
create index media_post_idx on media (post_id);
create index media_processing_idx on media (status) where status = 'PROCESSING';
