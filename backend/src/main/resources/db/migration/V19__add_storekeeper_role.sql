-- Dördüncü rol: depo sorumlusu (TASARIM.md "Kişiler"). Patron Katılımcılar'dan seçer; çalışan gibi yoklamada
-- sayılır, ayrıca şantiyenin imalatını görür. İleride depo ve malzeme de bu role bağlanır.
alter table users drop constraint users_role_check;
alter table users add constraint users_role_check
    check (role in ('OWNER', 'SITE_LEAD', 'WORKER', 'STOREKEEPER'));
