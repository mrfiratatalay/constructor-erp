-- Web Push anahtar çifti (VAPID): ilk açılışta üretilir, burada saklanır. Değişirse telefonların aboneliği bozulur.
create table vapid_keys (
    id          integer primary key,
    public_key  varchar(200)  not null,
    private_key varchar(400)  not null,
    created_at  timestamptz   not null
);

-- Bir kullanıcının bildirim alan cihazları (telefon, tablet, bilgisayar).
create table push_subscriptions (
    id         uuid primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    endpoint   text        not null unique,
    created_at timestamptz not null
);
create index push_subscriptions_user_idx on push_subscriptions (user_id);

-- Gönderilen bildirimler. Telefon "dürtülünce" içeriği buradan okur.
create table notifications (
    id         uuid primary key,
    user_id    uuid         not null references users (id) on delete cascade,
    title      varchar(120) not null,
    body       varchar(300) not null,
    url        varchar(300) not null,
    created_at timestamptz  not null
);
create index notifications_user_idx on notifications (user_id, created_at desc);
