-- f1sp.driver_w_data source

create or replace
algorithm = UNDEFINED view `driver_w_data` as
select
    `c`.`alpha2_code` as `alpha2_code`,
    `c`.`alpha3_code` as `alpha3_code`,
    `c`.`demonym` as `demonym`,
    `c`.`name` as `country_name`,
    `sds`.`year` as `year`,
    `sds`.`position_display_order` as `position_display_order`,
    `sds`.`position_text` as `position_text`,
    `sds`.`points` as `points`,
    `d`.`id` as `id`,
    `d`.`name` as `name`,
    `d`.`first_name` as `first_name`,
    `d`.`last_name` as `last_name`,
    `d`.`full_name` as `full_name`,
    `d`.`abbreviation` as `abbreviation`,
    `d`.`permanent_number` as `permanent_number`,
    `d`.`gender` as `gender`,
    `d`.`date_of_birth` as `date_of_birth`,
    `d`.`date_of_death` as `date_of_death`,
    `d`.`place_of_birth` as `place_of_birth`,
    `d`.`country_of_birth_country_id` as `country_of_birth_country_id`,
    `d`.`nationality_country_id` as `nationality_country_id`,
    `d`.`second_nationality_country_id` as `second_nationality_country_id`,
    `d`.`best_championship_position` as `best_championship_position`,
    `d`.`best_starting_grid_position` as `best_starting_grid_position`,
    `d`.`best_race_result` as `best_race_result`,
    `d`.`total_championship_wins` as `total_championship_wins`,
    `d`.`total_race_entries` as `total_race_entries`,
    `d`.`total_race_starts` as `total_race_starts`,
    `d`.`total_race_wins` as `total_race_wins`,
    `d`.`total_race_laps` as `total_race_laps`,
    `d`.`total_podiums` as `total_podiums`,
    `d`.`total_points` as `total_points`,
    `d`.`total_championship_points` as `total_championship_points`,
    `d`.`total_pole_positions` as `total_pole_positions`,
    `d`.`total_fastest_laps` as `total_fastest_laps`,
    `d`.`total_driver_of_the_day` as `total_driver_of_the_day`,
    `d`.`total_grand_slams` as `total_grand_slams`
from
    ((`driver` `d`
join `season_driver_standing` `sds` on
    ((`d`.`id` = `sds`.`driver_id`)))
join `country` `c` on
    ((`d`.`country_of_birth_country_id` = `c`.`id`)));