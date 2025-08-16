-- f1sp.race_next source

create or replace
algorithm = UNDEFINED view `race_next` as
select `r`.`id` as `id`,
-- --     `d`.`name` as `driver_name`,
--     `rd`.`driver_number` as `driver_number`,
-- --     `d`.`permanent_number` as `permanent_number`,
--     `rd`.`race_id` as `race_id`,
--     `rd`.`position_display_order` as `position_display_order`,
--     `rd`.`position_number` as `position_number`,
--     `rd`.`position_text` as `position_text`,
--     `rd`.`driver_id` as `driver_id`,
--     `rd`.`constructor_id` as `constructor_id`,
--     `rd`.`engine_manufacturer_id` as `engine_manufacturer_id`,
--     `rd`.`tyre_manufacturer_id` as `tyre_manufacturer_id`,
--     `rd`.`race_shared_car` as `shared_car`,
--     `rd`.`race_laps` as `laps`,
--     `rd`.`race_time` as `time`,
--     `rd`.`race_time_millis` as `time_millis`,
--     `rd`.`race_time_penalty` as `time_penalty`,
--     `rd`.`race_time_penalty_millis` as `time_penalty_millis`,
--     `rd`.`race_gap` as `gap`,
--     `rd`.`race_gap_millis` as `gap_millis`,
--     `rd`.`race_gap_laps` as `gap_laps`,
--     `rd`.`race_interval` as `interval`,
--     `rd`.`race_interval_millis` as `interval_millis`,
--     `rd`.`race_reason_retired` as `reason_retired`,
--     `rd`.`race_points` as `points`,
--     `rd`.`race_pole_position` as `pole_position`,
--     `rd`.`race_qualification_position_number` as `qualification_position_number`,
--     `rd`.`race_qualification_position_text` as `qualification_position_text`,
--     `rd`.`race_grid_position_number` as `grid_position_number`,
--     `rd`.`race_grid_position_text` as `grid_position_text`,
--     `rd`.`race_positions_gained` as `positions_gained`,
--     `rd`.`race_pit_stops` as `pit_stops`,
--     `rd`.`race_fastest_lap` as `fastest_lap`,
--     `rd`.`race_driver_of_the_day` as `driver_of_the_day`,
--     `rd`.`race_grand_slam` as `grand_slam`,
--     `r`.`year` as `year`,
`r`.`date` as `date`,
`r`.`time` as `time`,
STR_TO_DATE(CONCAT(r.date, ' ', r.time), '%Y-%m-%d %H:%i:%s') as `date_time`,
--     r.circuit_id,
`c`.`name` as `circuit_name`
from `race` `r`
    JOIN `circuit` `c` on
    	`r`.`circuit_id` = `c`.`id`
WHERE r.id = (
    SELECT r.id
    FROM race r
    WHERE r.id > (
        SELECT MAX(r.id)
        FROM race r
        JOIN race_result rr ON r.id = rr.race_id
        WHERE rr.time IS NOT NULL
    )
    ORDER BY r.id ASC
    LIMIT 1
);
-- STR_TO_DATE(CONCAT(r.date, ' ', r.time), '%Y-%m-%d %H:%i:%s') > NOW()
-- 	`rr`.`position_number` is null
-- 	and `rr`.`time` is null
-- 	and `rr`.`driver_id` is null
-- 	and `d`.`name` is null
order by `r`.`id` desc
limit 1;


SELECT id + 1
FROM race r
join race_result rr on r.id = rr.race_id 
where rr.time is not null
order by id desc
limit 1;

SELECT
    c.name,
    r.id AS id
FROM race r
JOIN circuit c ON r.circuit_id = c.id
WHERE r.id = (
    SELECT r.id
    FROM race r
    WHERE r.id > (
        SELECT MAX(r.id)
        FROM race r
        JOIN race_result rr ON r.id = rr.race_id
        WHERE rr.time IS NOT NULL
    )
    ORDER BY r.id ASC
    LIMIT 1
)
ORDER BY r.id DESC;



select * from race_next