-- f1sp.engine_w_country source

create or replace
algorithm = UNDEFINED view `engine_w_country` as
select
    `em`.`name` as `manafacturer`,
    `em`.`country_id` as `country_id`,
    `c`.`alpha2_code` as `alpha2_code`,
    `e`.`id` as `id`,
    `e`.`engine_manufacturer_id` as `engine_manufacturer_id`,
    `e`.`name` as `name`,
    `e`.`full_name` as `full_name`,
    `e`.`capacity` as `capacity`,
    `e`.`configuration` as `configuration`,
    `e`.`aspiration` as `aspiration`
from
    ((`engine` `e`
join `engine_manufacturer` `em` on
    ((`e`.`engine_manufacturer_id` = `em`.`id`)))
join `country` `c` on
    ((`em`.`country_id` = `c`.`id`)));