-- f1sp.driver_w_constructor_by_year source

create or replace
algorithm = UNDEFINED view `driver_w_constructor_by_year` as
select
    distinct `d`.`name` as `name`,
    `d`.`id` as `driver_id`,
    `c`.`full_name` as `full_name`,
    `c`.`id` as `constructor_id`,
    `r`.year
from
    (((`driver` `d`
join `race_data` `rd` on
    ((`d`.`id` = `rd`.`driver_id`)))
join `race` `r` on
    ((`rd`.`race_id` = `r`.`id`)))
join `constructor` `c` on
    ((`rd`.`constructor_id` = `c`.`id`)))
where
    ((`rd`.`type` = 'RACE_RESULT'))
group by
    `d`.`id`,
    `rd`.`race_id`,
    `c`.`id`,
    `c`.`full_name`;
