-- Sunucunun saati değiştirilemez: çekim gece de yapılsa şefin sorunu öğleden sonra, patronun cevabı birkaç dakika sonra
-- yazılmış görünsün (:'body' mesajın metni, :'time' ör. 14:20). Gönderildikten hemen sonra, ekran yenilenmeden çalışır.
update posts
set created_at = ((now() at time zone 'Europe/Istanbul')::date + :'time'::time) at time zone 'Europe/Istanbul'
where body = :'body';
