-- Saha çekimi şefin sorununu ve patronun cevabını ekrandan yazar. Yeniden çekerken önce o iki mesaj silinir; metinleri
-- capture/saha.mjs verir (:'issue', :'reply'). Bu mesajlara bağlanan (fotoğraf, cevap) bir şey yoktur.
delete from posts where body in (:'issue', :'reply');
