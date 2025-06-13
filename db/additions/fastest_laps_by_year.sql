-- f1sp.fastest_laps_by_year source

create or replace
algorithm = UNDEFINED view `fastest_laps_by_year` as
select
    `r`.`year` as `year`,
    `driver`.`name` as `name`,
    count(0) as `fastest_laps`
from
    ((`race_result` `rr`
join `driver` on
    ((`rr`.`driver_id` = `driver`.`id`)))
join `race` `r` on
    ((`rr`.`race_id` = `r`.`id`)))
where
    (`rr`.`fastest_lap` = 1)
group by
    `r`.`year`,
    `driver`.`name`
order by
    `r`.`year` desc;