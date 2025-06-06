-- f1sp.drivers_most_points_no_wins source

create or replace
algorithm = UNDEFINED view `drivers_most_points_no_wins` as
select
    sum(`rr`.`points`) as `totalPoints`,
    `rr`.`driver_id` as `driver_id`,
    `d`.`name` as `name`
from
    (`race_result` `rr`
join `driver` `d` on
    ((`rr`.`driver_id` = `d`.`id`)))
where
    `rr`.`driver_id` in (
    select
        `rd`.`driver_id`
    from
        `race_data` `rd`
    where
        ((`rd`.`type` = 'RACE_RESULT')
            and (`rd`.`position_number` = 1))) is false
group by
    `rr`.`driver_id`
order by
    `totalPoints` desc;