-- f1sp.total_wins_by_driver source

create or replace
algorithm = UNDEFINED view `total_wins_by_driver` as
select
    `r`.`id` as `race_id`,
    `r`.`official_name` as `official_name`,
    `r`.`date` as `date`,
    `rd2`.`position_number` as `starting_position`,
    `d`.`id` as `id`,
    `d`.`full_name` as `full_name`
from
    (((`driver` `d`
join `race_data` `rd` on
    (((`d`.`id` = `rd`.`driver_id`) and (`rd`.`type` = 'RACE_RESULT') and (`rd`.`position_number` = 1))))
join `race_data` `rd2` on
    (((`rd`.`race_id` = `rd2`.`race_id`) and (`rd2`.`driver_id` = `d`.`id`) and (`rd2`.`type` = 'STARTING_GRID_POSITION'))))
join `race` `r` on
    ((`rd`.`race_id` = `r`.`id`)))
group by
    `r`.`id`,
    `r`.`official_name`,
    `r`.`date`,
    `rd2`.`position_number`,
    `d`.`id`,
    `d`.`full_name`
order by
    `r`.`id` desc;