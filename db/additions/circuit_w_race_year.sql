-- f1sp.circuit_w_race_year source

create or replace
algorithm = UNDEFINED view `circuit_w_race_year` as
select
    `r`.`id` as `race_id`,
    `r`.`year` as `race_year`,
    `c`.`id` as `id`,
    `c`.`name` as `name`,
    `c`.`full_name` as `full_name`,
    `c`.`previous_names` as `previous_names`,
    `c`.`type` as `type`,
    `c`.`direction` as `direction`,
    `c`.`place_name` as `place_name`,
    `c`.`country_id` as `country_id`,
    `c`.`latitude` as `latitude`,
    `c`.`longitude` as `longitude`,
    `c`.`length` as `length`,
    `c`.`turns` as `turns`,
    `c`.`total_races_held` as `total_races_held`
from
    (`circuit` `c`
join `race` `r` on
    ((`c`.`id` = `r`.`circuit_id`)))
where
    (`r`.`year` between 2015 and 2025)
order by
    `c`.`full_name`;