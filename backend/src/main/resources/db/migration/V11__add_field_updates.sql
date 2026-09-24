-- Saha güncellemesi: şantiyenin Saha sekmesinden yazılan gönderi ("5. kat kalıpları tamamlandı" + fotoğraf).
-- Ayrı bir kayıt değil, işaretli bir gönderidir: sohbette de görünür; Saha sekmesi yalnızca bunları gösterir.
alter table posts add column is_field_update boolean not null default false;

-- Saha akışı en yeniden eskiye, (zaman, kimlik) çiftiyle sayfalanır; sohbetin dizinine binmez.
create index posts_site_field_idx on posts (site_id, created_at desc, id desc) where is_field_update;
