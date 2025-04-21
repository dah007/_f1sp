-- f1sp.total_wins_by_year source

create or replace
algorithm = UNDEFINED view `total_wins_by_year` as
select
    count(`d`.`id`) as `total`,
    `d`.`full_name` as `name`,
    `d`.`id` as `id`,
    `r`.`year` as `year`
from
    (((`race_result` `rr`
join `constructor` `c` on
    ((`rr`.`constructor_id` = `c`.`id`)))
join `driver` `d` on
    ((`rr`.`driver_id` = `d`.`id`)))
join `race` `r` on
    ((`rr`.`race_id` = `r`.`id`)))
where
    (`rr`.`position_number` = 1)
group by
    `d`.`id`,
    `r`.`year`
order by
    `total` desc;