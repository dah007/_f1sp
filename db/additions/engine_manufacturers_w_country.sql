-- f1sp.engine_manufacturers_w_country source

create or replace
algorithm = UNDEFINED view `engine_manufacturers_w_country` as

select em.*,
        c.name as country_name,
        c.alpha2_code
from engine_manufacturer em
        inner join country c on em.country_id = c.id
group by em.id;