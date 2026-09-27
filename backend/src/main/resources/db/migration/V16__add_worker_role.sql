-- Üç rol (TASARIM.md "Kişiler"): firmanın bağlantısıyla gelen herkes çalışandır, şefi patron seçer; şef her sabah
-- yoklamayı alır. Bugüne kadar bağlantıyla gelen herkes şef yazılıyordu: hepsi çalışan olur, patron gerçek şefleri
-- Katılımcılar'dan seçer.
alter table users drop constraint users_role_check;
alter table users add constraint users_role_check check (role in ('OWNER', 'SITE_LEAD', 'WORKER'));

update users set role = 'WORKER' where role = 'SITE_LEAD';
