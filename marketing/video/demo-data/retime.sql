-- API geçmişe saat yazamaz: patronun bu gece doldurduğu geçmiş günler, o günün sabahı şefin elinden düşmüş gibi
-- görünsün diye kaydırılır. Gerçek hayatta şef her sabah 08:00 ile 08:40 arasında yoklamayı alır; hangi şefin
-- aldığı güne göre değişir. Bugünün kayıtlarına dokunulmaz: onları çekim sırasında şef ekrandan girer.
update puantaj_marks m
set marked_at = (m.day + time '08:00' + (abs(hashtext(m.entry_id::text || m.day::text)) % 40) * interval '1 minute')
                at time zone 'Europe/Istanbul',
    marked_by = case when extract(day from m.day)::int % 3 = 0 then :'serkan'::uuid else :'ahmet'::uuid end
where m.day < (now() at time zone 'Europe/Istanbul')::date;
