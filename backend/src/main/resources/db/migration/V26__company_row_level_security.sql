-- Firma izolasyonunun ikinci katmanı (MIMARI-SAAS.md Karar 4): PostgreSQL Row-Level Security. Uygulama her firma
-- isteğinde bağlantıya app.company_id yazar; firmaya ait tablolarda başka firmanın satırı okunamaz, yazılamaz. Bir
-- servis firma filtresini unutsa bile veri sızmaz. Bağlam yokken (platform yönetimi, zamanlanmış işler, migration)
-- kısıt uygulanmaz; bu kodlar firmayı açıkça belirtir.

create function current_company_id() returns uuid
    language sql
    stable
as
$$
select nullif(current_setting('app.company_id', true), '')::uuid
$$;

-- Yeni modül tablosu da tek satırla korunur: select enable_company_isolation('tablo_adi');
-- FORCE: tablo sahibi olan uygulama kullanıcısına da uygulanır.
create function enable_company_isolation(target regclass) returns void
    language plpgsql
as
$$
begin
    execute format('alter table %s enable row level security', target);
    execute format('alter table %s force row level security', target);
    execute format('create policy company_isolation on %s '
                       || 'using (current_company_id() is null or company_id = current_company_id()) '
                       || 'with check (current_company_id() is null or company_id = current_company_id())', target);
end
$$;

select enable_company_isolation('sites');
select enable_company_isolation('posts');
select enable_company_isolation('media');
select enable_company_isolation('tasks');
select enable_company_isolation('site_workers');
select enable_company_isolation('attendances');
select enable_company_isolation('member_attendance');
select enable_company_isolation('roster_entries');
select enable_company_isolation('puantaj_marks');
select enable_company_isolation('materials');
select enable_company_isolation('stock_locations');
select enable_company_isolation('material_parties');
select enable_company_isolation('material_shipments');
select enable_company_isolation('material_documents');
select enable_company_isolation('production_items');
select enable_company_isolation('production_entries');

-- Süper kullanıcı RLS'e takılmaz. Uygulama süper kullanıcıyla bağlanıyorsa (ör. Docker'daki varsayılan kullanıcı)
-- firma isteklerinde bu yetkisiz role geçer (TenantScopedDataSource); böylece koruma her kurulumda çalışır. Rol
-- açmaya yetkisi olmayan kullanıcı zaten süper kullanıcı değildir: kısıt ona doğrudan uygulanır.
do
$$
    begin
        if not exists (select 1 from pg_roles where rolname = 'constructor_tenant')
            and (select rolsuper or rolcreaterole from pg_roles where rolname = current_user) then
            create role constructor_tenant nologin;
        end if;
        if exists (select 1 from pg_roles where rolname = 'constructor_tenant') then
            grant usage on schema public to constructor_tenant;
            grant select, insert, update, delete on all tables in schema public to constructor_tenant;
            grant usage, select on all sequences in schema public to constructor_tenant;
            alter default privileges in schema public grant select, insert, update, delete on tables to constructor_tenant;
            alter default privileges in schema public grant usage, select on sequences to constructor_tenant;
        end if;
    end
$$;
