-- f1sp.engine_manufacturers_w_country source

create or replace
algorithm = UNDEFINED view `engine_manufacturers_w_country` as
select
    `c`.`name` as `country_name`,
    `em`.`id` as `id`,
    `em`.`name` as `name`,
    `em`.`country_id` as `country_id`,
    `em`.`best_championship_position` as `best_championship_position`,
    `em`.`best_starting_grid_position` as `best_starting_grid_position`,
    `em`.`best_race_result` as `best_race_result`,
    `em`.`total_championship_wins` as `total_championship_wins`,
    `em`.`total_race_entries` as `total_race_entries`,
    `em`.`total_race_starts` as `total_race_starts`,
    `em`.`total_race_wins` as `total_race_wins`,
    `em`.`total_race_laps` as `total_race_laps`,
    `em`.`total_podiums` as `total_podiums`,
    `em`.`total_podium_races` as `total_podium_races`,
    `em`.`total_points` as `total_points`,
    `em`.`total_championship_points` as `total_championship_points`,
    `em`.`total_pole_positions` as `total_pole_positions`,
    `em`.`total_fastest_laps` as `total_fastest_laps`
from
    (`engine_manufacturer` `em`
join `country` `c` on
    ((`em`.`country_id` = `c`.`id`)));