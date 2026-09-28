-- İş teslimi (TASARIM.md "İş teslimi"): çalışan kendisine verilen görevi fotoğrafla teslim eder, şef ya da patron
-- onaylar ya da eksiğini fotoğrafın üstünde gösterip geri gönderir. Yeni bir iş sistemi değildir: mevcut görevin
-- durumuna iki adım eklenir, her teslim ayrı satırdır (iş kaç kez gidip gelirse geçmişi kalır).

-- Kontrolde: teslim edildi, şef bakacak. Eksik var: şef geri gönderdi, çalışan tamamlayıp yeniden teslim eder.
alter table tasks drop constraint tasks_status_check;
alter table tasks add constraint tasks_status_check
    check (status in ('TODO', 'IN_PROGRESS', 'SUBMITTED', 'RETURNED', 'DONE'));

-- Bir teslim: sohbete düşen fotoğraflı mesajı (post_id), kim ne zaman teslim etti, kim ne zaman inceledi. Eksik
-- varsa notu ve fotoğraflardan birinin üstündeki nokta (mark_x, mark_y: fotoğrafın genişliğine ve yüksekliğine
-- göre 0-1 arası; ekran boyutundan bağımsız).
create table task_deliveries (
    id            uuid primary key,
    task_id       uuid         not null references tasks (id) on delete cascade,
    company_id    uuid         not null references companies (id),
    post_id       uuid         not null references posts (id),
    delivered_by  uuid         not null references users (id),
    delivered_at  timestamptz  not null,
    status        varchar(10)  not null check (status in ('PENDING', 'APPROVED', 'RETURNED')),
    reviewed_by   uuid references users (id),
    reviewed_at   timestamptz,
    missing_note  varchar(300),
    mark_media_id uuid references media (id) on delete set null,
    mark_x        real check (mark_x between 0 and 1),
    mark_y        real check (mark_y between 0 and 1),
    check ((status = 'PENDING') = (reviewed_at is null)),
    check ((status = 'RETURNED') = (missing_note is not null))
);
create index task_deliveries_task_idx on task_deliveries (task_id, delivered_at);

-- Teslim mesajı ve şefin cevabı sohbette bu teslime bağlıdır: baloncukta kartı çizilir. Teslim satırı da kendi
-- mesajını gösterdiği için iki yön birbirini tutar; biri önce yazılabilsin diye kontrol işlem sonuna ertelenir.
-- Görev silinince teslimleri gider, mesajlar sohbette düz mesaj olarak kalır.
alter table posts add column delivery_id uuid
    references task_deliveries (id) on delete set null deferrable initially deferred;
create index posts_delivery_idx on posts (delivery_id) where delivery_id is not null;
