-- f1sp.highest_points_no_wins source

create or replace
algorithm = UNDEFINED view `highest_points_no_wins` as
select
    sum(`race_result`.`points`) as `sum(points)`,
    `race_result`.`driver_id` as `driver_id`
from
    `race_result`
where
    ((`race_result`.`points` > 0)
        and `race_result`.`driver_id` in (
        select
            `race_result`.`driver_id`
        from
            `race_result`
        where
            (`race_result`.`position_number` = 1)) is false)
group by
    `race_result`.`driver_id`
order by
    sum(`race_result`.`points`) desc;