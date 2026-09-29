-- Teslim alma adımı kalktı. Sevkiyat çıktığında yazılır ve biter; kamyonun vardığını ayrıca onaylamak bu işin
-- gerçeğine uymayan bir bürokrasiydi. Kimse o düğmeye basmayınca kayıtlar sonsuza kadar "Yolda" kalır ve ekran
-- yalan söylerdi. Geriye iki hal kalır: kayıtlı ve iptal.

-- Kısıt önce kalkar: eski kısıt dururken yeni değer yazılamaz.
alter table material_shipments drop constraint if exists material_shipments_status_check;

update material_shipments set status = 'RECORDED' where status <> 'CANCELLED';

alter table material_shipments add constraint material_shipments_status_check
    check (status in ('RECORDED', 'CANCELLED'));
