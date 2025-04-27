-- f1sp.rr_w_driver source

create or replace
algorithm = UNDEFINED view `rr_w_driver` as
select
    `d`.`name` as `driver_name`,
    `rd`.`driver_number` as `driver_number`,
    `d`.`permanent_number` as `permanent_number`,
    `rd`.`race_id` as `race_id`,
    `rd`.`position_display_order` as `position_display_order`,
    `rd`.`position_number` as `position_number`,
    `rd`.`position_text` as `position_text`,
    `rd`.`driver_id` as `driver_id`,
    `rd`.`constructor_id` as `constructor_id`,
    `rd`.`engine_manufacturer_id` as `engine_manufacturer_id`,
    `rd`.`tyre_manufacturer_id` as `tyre_manufacturer_id`,
    `rd`.`race_shared_car` as `shared_car`,
    `rd`.`race_laps` as `laps`,
    `rd`.`race_time` as `time`,
    `rd`.`race_time_millis` as `time_millis`,
    `rd`.`race_time_penalty` as `time_penalty`,
    `rd`.`race_time_penalty_millis` as `time_penalty_millis`,
    `rd`.`race_gap` as `gap`,
    `rd`.`race_gap_millis` as `gap_millis`,
    `rd`.`race_gap_laps` as `gap_laps`,
    `rd`.`race_interval` as `interval`,
    `rd`.`race_interval_millis` as `interval_millis`,
    `rd`.`race_reason_retired` as `reason_retired`,
    `rd`.`race_points` as `points`,
    `rd`.`race_pole_position` as `pole_position`,
    `rd`.`race_qualification_position_number` as `qualification_position_number`,
    `rd`.`race_qualification_position_text` as `qualification_position_text`,
    `rd`.`race_grid_position_number` as `grid_position_number`,
    `rd`.`race_grid_position_text` as `grid_position_text`,
    `rd`.`race_positions_gained` as `positions_gained`,
    `rd`.`race_pit_stops` as `pit_stops`,
    `rd`.`race_fastest_lap` as `fastest_lap`,
    `rd`.`race_driver_of_the_day` as `driver_of_the_day`,
    `rd`.`race_grand_slam` as `grand_slam`,
    `r`.`year` as `year`
from
    (`race_data` `rd`
join `driver` `d` on
    ((`rd`.`driver_id` = `d`.`id`)))
    inner join race r on rd.race_id = r.id
where
    (`rd`.`type` = 'RACE_RESULT')