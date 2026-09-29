-- API geçmişe saat yazamaz: şef günün ilerlemesini akşam, iş bitince girer (16:30 ile 18:30 arası); iş kalemi ilk
-- girişinin sabahı açılmıştır. Bugünün girişine dokunulmaz: onu çekimde şef ekrandan girer.
update production_entries e
set created_at = (e.day + time '16:30' + (abs(hashtext(e.id::text)) % 120) * interval '1 minute')
                 at time zone 'Europe/Istanbul'
where e.day < (now() at time zone 'Europe/Istanbul')::date;

update production_items i
set created_at = (i.start_date + time '08:15') at time zone 'Europe/Istanbul'
where i.start_date < (now() at time zone 'Europe/Istanbul')::date;
