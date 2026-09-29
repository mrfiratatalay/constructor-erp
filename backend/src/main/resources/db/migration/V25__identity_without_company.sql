-- Kişinin firması, rolü ve "firmada mı" bilgisi artık yalnızca üyelikte (company_memberships, V24'te aktarıldı ve
-- doğrulandı). users'taki kopyalar kalkar: aynı bilginin iki yerde durması, birinin eskimesi demektir.
alter table users
    drop column company_id,
    drop column role,
    drop column active;

-- Puantaj kalemi kişiye firma içinde tekildir: aynı kişi iki firmada çalışırsa her firmanın kendi kalemi olur.
alter table roster_entries drop constraint roster_entries_user_id_key;
create unique index roster_entries_company_user_uniq on roster_entries (company_id, user_id);
