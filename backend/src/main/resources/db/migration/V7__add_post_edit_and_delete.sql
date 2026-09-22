-- Defter iz bırakmadan değişmez (TASARIM.md İlke 6): silinen gönderinin satırı kalır, içeriği ve
-- dosyaları gider, yerinde "silindi" izi görünür. Düzeltilen gönderi "düzenlendi" diye işaretlenir.
alter table posts
    add column edited_at  timestamptz,
    add column deleted_at timestamptz,
    add column deleted_by uuid references users (id);
