-- Sorun gönderisi "çözüldü" denene kadar açık kalır; kimin, ne zaman, hangi notla çözdüğü saklanır.
alter table posts
    add column resolved_at     timestamptz,
    add column resolved_by     uuid references users (id),
    add column resolution_note text;

-- Açık sorunlar hem Sorunlar ekranında hem Bugün panelinde sık sorulur.
create index posts_open_issues_idx on posts (site_id, created_at desc) where is_issue and resolved_at is null;
