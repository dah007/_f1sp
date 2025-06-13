-- f1sp.total_constructor_wins_by_season source

create or replace
algorithm = UNDEFINED view `total_constructor_wins_by_season` as
select
    `r`.`year` as `year`,
    `constructor`.`name` as `name`,
    count(0) as `wins`
from
    ((`race_result` `rr`
join `constructor` on
    ((`rr`.`constructor_id` = `constructor`.`id`)))
join `race` `r` on
    ((`rr`.`race_id` = `r`.`id`)))
where
    (`rr`.`position_number` = 1)
group by
    `r`.`year`,
    `constructor`.`name`
order by
    `r`.`year` desc,
    `wins` desc;