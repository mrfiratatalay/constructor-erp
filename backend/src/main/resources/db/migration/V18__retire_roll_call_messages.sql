-- Sohbetteki yoklama mesajı ve "Yoklamaya Katıl" kalktı: yoklama şantiyenin değil firmanındır, şef onu Yoklama
-- menüsünde alır. Atılmış yoklama mesajlarının yazısı yoktu ve arayüz onları artık çizmez; silinen her mesaj gibi
-- yerlerinde "silindi" izi kalır (TASARIM.md İlke 6). Katılma kayıtları (member_attendance) verisiyle yerinde durur.
update posts
set body = null, deleted_at = now(), deleted_by = author_id, pinned_at = null, pinned_by = null
where roll_call_day is not null and deleted_at is null;
