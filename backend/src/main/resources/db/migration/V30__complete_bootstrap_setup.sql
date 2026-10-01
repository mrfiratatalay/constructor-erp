-- Açılışta kendiliğinden kurulan ilk firma (BootstrapOwner) patronuyla birlikte doğar, kurulum sihirbazından geçmez;
-- ama kurulumu bitmiş işaretlenmiyordu ve platform özeti onu sonsuza dek "kurulum bekliyor" sayıyordu. Patronu olan
-- firma kurulmuştur: sihirbazla kurulan firmanın patronu da sihirbazın son adımında yazılır.
update companies c
set setup_completed_at = c.created_at
where c.setup_completed_at is null
  and exists (select 1 from company_memberships m where m.company_id = c.id and m.role = 'OWNER');
