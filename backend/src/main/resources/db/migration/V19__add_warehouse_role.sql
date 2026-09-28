-- Dördüncü rol (Malzeme modülü): depo sorumlusu malzeme kartlarını, hareketleri ve stoğu yönetir. Yoklamada
-- sayılmaz, yoklama almaz; herkes gibi her şantiyeyi görür ve yazar. Patron Katılımcılar'dan "Depo sorumlusu yap" der.
alter table users drop constraint users_role_check;
alter table users add constraint users_role_check check (role in ('OWNER', 'SITE_LEAD', 'WAREHOUSE', 'WORKER'));
