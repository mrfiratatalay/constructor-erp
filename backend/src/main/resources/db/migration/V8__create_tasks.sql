-- Şantiyenin iş takibi: kim, neyi, ne zamana kadar yapacak. Görev şantiyesine aittir (TASARIM.md İlke 5).
-- Fotoğraf ya da not görevin içine ayrıca yüklenmez; akıştaki gönderiye bağlanır: dosyalar tek yerde yaşar.
create table tasks (
    id           uuid primary key,
    company_id   uuid         not null references companies (id),
    site_id      uuid         not null references sites (id),
    title        varchar(200) not null,
    note         text,
    assignee_id  uuid references users (id),
    due_date     date,
    status       varchar(20)  not null check (status in ('TODO', 'IN_PROGRESS', 'DONE')),
    priority     varchar(10)  not null check (priority in ('LOW', 'NORMAL', 'HIGH')),
    post_id      uuid references posts (id),
    created_by   uuid         not null references users (id),
    created_at   timestamptz  not null,
    completed_at timestamptz
);
create index tasks_site_idx on tasks (site_id, created_at);
