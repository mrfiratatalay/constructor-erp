-- Görev kartı (TASARIM.md "İş teslimi"): görev nereden açılırsa açılsın (sohbetin ＋'sı ya da Görevler sayfası)
-- şantiyenin sohbetine "📋 Görev" mesajı düşer; baloncukta görevin kartı çizilir (kime, ne zaman, durumu) ve
-- işin sorumlusu teslimi kartın düğmesiyle yapar. Teslim mesajı bu karta yanıt olarak düşer: sohbette görev →
-- teslim → şefin cevabı alt alta tek hikâye olarak okunur. Görev silinirse mesaj düz mesaj olarak kalır.
alter table posts add column task_id uuid references tasks (id) on delete set null;
create index posts_task_idx on posts (task_id) where task_id is not null;
