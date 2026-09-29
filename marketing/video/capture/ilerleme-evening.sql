-- Sunucunun saati değiştirilemez: çekim gece de yapılsa şefin girişi akşam, iş bitince yapılmış görünsün
-- (:'time', ör. 17:38). Kaydettikten hemen sonra, ekranlar yenilenmeden çalışır.
update production_entries
set created_at = ((now() at time zone 'Europe/Istanbul')::date + :'time'::time) at time zone 'Europe/Istanbul'
where day = (now() at time zone 'Europe/Istanbul')::date;
