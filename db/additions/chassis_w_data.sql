-- f1sp.chassis_w_data source

create or replace
algorithm = UNDEFINED view `chassis_w_data` as
select
    `sec`.`year` as `year`,
    `con`.`name` as `constructor`,
    `c`.`id` as `id`,
    `c`.`constructor_id` as `constructor_id`,
    `c`.`name` as `name`,
    `c`.`full_name` as `full_name`
from
    ((`chassis` `c`
join `constructor` `con` on
    ((`c`.`constructor_id` = `con`.`id`)))
join `season_entrant_chassis` `sec` on
    ((`c`.`id` = `sec`.`chassis_id`)));