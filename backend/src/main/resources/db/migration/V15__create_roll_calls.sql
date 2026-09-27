-- Yoklamaya katıl (TASARIM.md "Yoklama"): şef sohbete günün yoklama mesajını atar, çalışan kendi telefonundan
-- mesajdaki düğmeye basıp katılır. Yoklamada firmanın kişileri sayılır (patronlar hariç); telefonsuz personel
-- listesi (site_workers, attendances) arayüzden kalktı ama verisi yerinde duruyor.

-- Yoklama mesajı işaretli bir gönderidir (WhatsApp'taki anket gibi): sohbette görünür, hangi günün yoklaması
-- olduğu burada durur. Bir şantiyede günde bir yoklama mesajı; silinirse yenisi atılabilir.
alter table posts add column roll_call_day date;
create unique index posts_roll_call_uniq on posts (site_id, roll_call_day)
    where roll_call_day is not null and deleted_at is null;

-- Kişinin bir günü. Kendisi katıldıysa geldi (hangi şantiyede, saat kaçta); katılmayanı patron işaretler.
-- Patron sonradan değiştirse de katılma izi (site_id, checked_in_at) kalır. Kaydı olmayan gün yazılmaz:
-- "katılmadı" o gün yoklama mesajı olup kişinin kaydı olmamasından hesaplanır.
create table member_attendance (
    user_id       uuid        not null references users (id),
    day           date        not null,
    company_id    uuid        not null references companies (id),
    status        varchar(10) not null check (status in ('PRESENT', 'ABSENT', 'EXCUSED')),
    reason        varchar(10) check (reason in ('SICK', 'UNEXCUSED', 'OTHER')),
    site_id       uuid references sites (id),
    checked_in_at timestamptz,
    marked_by     uuid references users (id),
    marked_at     timestamptz,
    primary key (user_id, day),
    check ((status = 'ABSENT') = (reason is not null))
);
create index member_attendance_company_day_idx on member_attendance (company_id, day);
