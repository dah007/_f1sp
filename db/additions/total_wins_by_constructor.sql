-- f1sp.constructors_with_data source

create or replace
algorithm = UNDEFINED view `constructors_with_data` as
select
    `c`.`id` as `id`,
    `c`.`name` as `name`,
    `c`.`full_name` as `full_name`,
    `c`.`country_id` as `country_id`,
    `c`.`best_championship_position` as `best_championship_position`,
    `c`.`best_starting_grid_position` as `best_starting_grid_position`,
    `c`.`best_race_result` as `best_race_result`,
    `c`.`total_championship_wins` as `total_championship_wins`,
    `c`.`total_race_entries` as `total_race_entries`,
    `c`.`total_race_starts` as `total_race_starts`,
    `c`.`total_race_wins` as `total_race_wins`,
    `c`.`total_1_and_2_finishes` as `total_1_and_2_finishes`,
    `c`.`total_race_laps` as `total_race_laps`,
    `c`.`total_podiums` as `total_podiums`,
    `c`.`total_podium_races` as `total_podium_races`,
    `c`.`total_points` as `total_points`,
    `c`.`total_championship_points` as `total_championship_points`,
    `c`.`total_pole_positions` as `total_pole_positions`,
    `c`.`total_fastest_laps` as `total_fastest_laps`,
    `c2`.`alpha2_code` as `alpha2_code`,
    `c2`.`name` as `country`
from
    (((`constructor` `c`
join `country` `c2` on
    ((`c`.`country_id` = `c2`.`id`)))
join `race_data` `rd` on
    ((`c`.`id` = `rd`.`constructor_id`)))
join `race` `r` on
    ((`rd`.`race_id` = `r`.`id`)))
where
    (`rd`.`type` = 'RACE_RESULT')
group by
    `c`.`id`
order by
    `c`.`name`;