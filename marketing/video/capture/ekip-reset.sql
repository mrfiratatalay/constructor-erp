-- Ekip çekiminde yeni usta firmanın bağlantısından ekrandan katılır. Yeniden çekerken önce o kişi ve bıraktığı her
-- iz silinir: oturumları, şantiye akışlarındaki "katıldı" satırları, yoklamadaki kalemi. Kişiyi gösteren her yabancı
-- anahtar (users'a bakan her kolon) veritabanının kendisinden okunur: yeni bir tablo eklense de unutulmaz.
-- psql değişkeni $$ bloğunun içine girmez: numara önce oturum ayarına yazılır, blok oradan okur.
select set_config('ekip.phone', regexp_replace(:'phone', '\D', '', 'g'), false) \gset
do $$
declare
  worker uuid := (select id from users where regexp_replace(phone, '\D', '', 'g') = current_setting('ekip.phone'));
  link record;
begin
  if worker is null then return; end if;
  for link in
    select c.conrelid::regclass as tbl, a.attname as col
    from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.contype = 'f' and c.confrelid = 'users'::regclass
  loop
    execute format('delete from %s where %I = $1', link.tbl, link.col) using worker;
  end loop;
  delete from users where id = worker;
end $$;
