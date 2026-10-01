-- Adlar Türkçe alfabeyle sıralanır. Veritabanı Alpine imajında çalışır: musl yerel sıralama kurallarını bilmez, en_US
-- ayarında da "order by name" bayt sırasıyla çalışıyordu ve Ç, Ş, Ö, Ü, İ ile başlayan her ad (Çimento, Şükrü, Özkan
-- İnşaat…) listenin en sonuna düşüyordu. ICU'nun Türkçe kuralı (tr-x-icu) PostgreSQL'le birlikte gelir. Belirlenimci
-- (deterministic) bir kuraldır: eşitlik bayt eşitliği olarak kalır, benzersizlik kısıtları değişmez. Sütuna bağlanınca
-- türetilmiş sorgular dahil bütün sıralamalar kendiliğinden doğru olur; kod değişmez.
alter table companies alter column name type varchar(120) collate "tr-x-icu";
alter table sites alter column name type varchar(120) collate "tr-x-icu";
alter table users alter column full_name type varchar(120) collate "tr-x-icu";
alter table roster_entries alter column name type varchar(120) collate "tr-x-icu";
alter table site_workers alter column full_name type varchar(120) collate "tr-x-icu";
alter table materials alter column name type varchar(120) collate "tr-x-icu";
alter table material_parties alter column name type varchar(120) collate "tr-x-icu";
alter table stock_locations alter column name type varchar(120) collate "tr-x-icu";
