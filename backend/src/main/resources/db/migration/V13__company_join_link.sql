-- Firmaya katılma bağlantısı (WhatsApp grup bağlantısı gibi): firma başına tek, süresiz, çok kullanımlık.
-- Patron onu WhatsApp grubuna atar; tıklayan adını ve numarasını yazıp katılır. Sızarsa patron sıfırlar: yeni
-- anahtar yazılır, eskisi çalışmaz. Patron bağlantıyı istediği zaman yeniden paylaşabilsin diye anahtarın
-- kendisi tutulur (tek kullanımlık giriş linki gibi özeti değil).
alter table companies add column join_token varchar(64) unique;

-- Herkes her şantiyededir: şantiye başına üyelik ve tek kişilik, 7 günlük şantiye davetleri kalktı.
-- Geçmişteki "Musa eklendi" sistem satırları site_events'te olduğu gibi durur.
drop table site_invites;
drop table site_members;
