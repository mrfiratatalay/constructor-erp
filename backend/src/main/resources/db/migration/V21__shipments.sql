-- Malzeme modülü sadeleşti: modülün konusu artık stok değil, sevkiyattır. Bir sevkiyat bir kamyondur: tek hedef,
-- tek irsaliye, içinde birden çok kalem. Stok sayısı bir kolon değildir, sevkiyatlardan hesaplanır ve yalnızca
-- malzeme seçilirken tek satır olarak gösterilir; ayrı stok ekranı, kritik eşik ve sayım düzeltmesi kalktı.

-- Hareket artık sevkiyat: tablolar da öyle okunur.
alter table material_movements rename to material_shipments;
alter table material_movement_events rename to material_shipment_events;
alter sequence material_movement_number_seq rename to material_shipment_number_seq;
alter table material_shipment_events rename column movement_id to shipment_id;
alter table material_documents rename column movement_id to shipment_id;
alter table material_field_posts rename column movement_id to shipment_id;

-- Şantiyede harcama ve sayım düzeltmesi kalktı: ikisi de yalnızca stok sayısını değiştirmek için vardı.
delete from material_field_posts where shipment_id in
    (select id from material_shipments where type in ('USED', 'ADJUSTMENT'));
delete from material_shipment_events where shipment_id in
    (select id from material_shipments where type in ('USED', 'ADJUSTMENT'));
delete from material_documents where shipment_id in
    (select id from material_shipments where type in ('USED', 'ADJUSTMENT'));
delete from material_shipments where type in ('USED', 'ADJUSTMENT');

-- Dışarı verilen malzemede tek soru kaldı: geri gelecek mi? Satıldı / Ödünç / Destek ayrımı, iki müteahhidin
-- kendi anlaşmasıdır (para, iş karşılığı, hatır); yazılım bilemez ve fatura kesmez. Anlaşma açıklamaya yazılır.
alter table material_shipments add column expects_return boolean not null default false;
update material_shipments set expects_return = true where purpose = 'LOANED';

-- Kalemler ayrı tabloya taşınır: bir irsaliye, birden çok malzeme.
create table material_shipment_lines (
    id          uuid           primary key,
    shipment_id uuid           not null references material_shipments (id) on delete cascade,
    material_id uuid           not null references materials (id),
    quantity    numeric(14, 3) not null check (quantity > 0)
);
create index material_shipment_lines_shipment_idx on material_shipment_lines (shipment_id);
create index material_shipment_lines_material_idx on material_shipment_lines (material_id);

insert into material_shipment_lines (id, shipment_id, material_id, quantity)
select gen_random_uuid(), id, material_id, quantity from material_shipments;

alter table material_shipments drop column material_id, drop column quantity;

-- Durum üçe indi: Yolda → Teslim alındı, bir de İptal. Kontrol bekleyen "yolda"dır; tamamlanan, iade bekleyen ve
-- iade edilen hep "teslim alındı"dır (iade beklemek durum değil, sevkiyatın expects_return özelliğidir).
update material_shipments set status = 'IN_TRANSIT' where status = 'PENDING_CHECK';
update material_shipments set status = 'DELIVERED'
    where status in ('COMPLETED', 'AWAITING_RETURN', 'PARTIALLY_RETURNED', 'RETURNED');
alter table material_shipments drop constraint if exists material_movements_status_check;
alter table material_shipments add constraint material_shipments_status_check
    check (status in ('IN_TRANSIT', 'DELIVERED', 'CANCELLED'));

alter table material_shipments drop constraint if exists material_movements_type_check;
alter table material_shipments add constraint material_shipments_type_check
    check (type in ('INBOUND', 'TO_SITE', 'TRANSFER', 'OUTBOUND', 'RETURN'));

-- Stoğa ait alanlar kalktı; kullanım alanı ve düzeltme nedeni de kalkan hareketlerle birlikte anlamını yitirdi.
alter table material_shipments
    drop column purpose,
    drop column usage_area,
    drop column reason,
    drop column system_quantity,
    drop column counted_quantity,
    drop column return_note,
    drop column expected_return_date;

-- Malzeme kartı ad ve birimden ibarettir. Kategori alanı sahada birim gibi dolduruluyordu ("Çimento · CUVAL");
-- kritik eşik ise stok sayılmadan anlamsızdır.
alter table materials
    drop column code,
    drop column category,
    drop column min_stock,
    drop column description;
