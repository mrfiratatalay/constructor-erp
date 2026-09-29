-- İlerleme çekimi bugünün girişini kendisi yapar (Demir İşleri +3,5 ton). Yeniden çekerken önce bugün girilenler
-- silinir; kart ve özet dünkü hâline döner.
delete from production_entries where day = (now() at time zone 'Europe/Istanbul')::date;
