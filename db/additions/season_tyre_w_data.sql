-- f1sp.season_tyre_w_data source

create or replace
algorithm = UNDEFINED view `season_tyre_w_data` as
select
    stm.tyre_manufacturer_id, 
    `stm`.`year` as `year`,
    `c`.`alpha2_code` as `alpha2_code`,
    `c`.`name` as `country`,
    `tm`.`name` as `name`,
    `stm`.`best_race_result` as `best_race_result`,
    `stm`.`best_starting_grid_position` as `best_starting_grid_position`,
    `stm`.`total_fastest_laps` as `total_fastest_laps`,
    `stm`.`total_podium_races` as `total_podium_races`,
    `stm`.`total_podiums` as `total_podiums`,
    `stm`.`total_pole_positions` as `total_pole_positions`,
    `stm`.`total_race_entries` as `total_race_entries`,
    `stm`.`total_race_laps` as `total_race_laps`,
    `stm`.`total_race_starts` as `total_race_starts`,
    `stm`.`total_race_wins` as `total_race_wins`
from
    ((`season_tyre_manufacturer` `stm`
join `tyre_manufacturer` `tm` on
    ((`tm`.`id` = `stm`.`tyre_manufacturer_id`)))
join `country` `c` on
    ((`tm`.`country_id` = `c`.`id`)))
order by
    `stm`.`year` desc;