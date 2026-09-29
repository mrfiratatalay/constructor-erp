-- Okunur numaralar ("SV-000123") firmaya göre sayılır. Tek ortak sıra, bir firmanın ekranındaki numara boşluklarından
-- diğer firmaların ne kadar iş yaptığını belli ederdi. Her firmanın her sayacı ayrı satırdır; sayma satır kilidiyle
-- yapılır, aynı anda gelen iki kayıt aynı numarayı alamaz. Mevcut numaralar değişmez; sayaç kaldığı yerden devam eder.
create table company_counters (
    company_id uuid        not null references companies (id),
    name       varchar(40) not null,
    value      bigint      not null,
    primary key (company_id, name)
);
select enable_company_isolation('company_counters');

insert into company_counters (company_id, name, value)
select company_id, 'material_shipment', max(number)
from material_shipments
group by company_id;

create function next_company_number(company uuid, counter text) returns bigint
    language sql
as
$$
insert into company_counters (company_id, name, value)
values (company, counter, 1)
on conflict (company_id, name) do update set value = company_counters.value + 1
returning value
$$;

create function assign_shipment_number() returns trigger
    language plpgsql
as
$$
begin
    new.number := next_company_number(new.company_id, 'material_shipment');
    return new;
end
$$;

create trigger material_shipments_number
    before insert
    on material_shipments
    for each row
execute function assign_shipment_number();

alter table material_shipments alter column number drop default;
alter table material_shipments drop constraint material_movements_number_key;
create unique index material_shipments_company_number_uniq on material_shipments (company_id, number);
drop sequence material_shipment_number_seq;
