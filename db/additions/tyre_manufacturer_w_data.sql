-- f1sp.tyre_manufacturer_w_data source

create or replace
algorithm = UNDEFINED view `tyre_manufacturer_w_data` as
select
    (
    select
        min(`stm`.`year`)
    from
        `season_tyre_manufacturer` `stm`
    where
        (`stm`.`tyre_manufacturer_id` = `tm`.`id`)) as `from_year`,
    (
    select
        max(`stm`.`year`)
    from
        `season_tyre_manufacturer` `stm`
    where
        (`stm`.`tyre_manufacturer_id` = `tm`.`id`)) as `to_year`,
    `tm`.`id` as `id`,
    `tm`.`name` as `name`,
    `tm`.`country_id` as `country_id`,
    `tm`.`best_starting_grid_position` as `best_starting_grid_position`,
    `tm`.`best_race_result` as `best_race_result`,
    `tm`.`total_race_entries` as `total_race_entries`,
    `tm`.`total_race_starts` as `total_race_starts`,
    `tm`.`total_race_wins` as `total_race_wins`,
    `tm`.`total_race_laps` as `total_race_laps`,
    `tm`.`total_podiums` as `total_podiums`,
    `tm`.`total_podium_races` as `total_podium_races`,
    `tm`.`total_pole_positions` as `total_pole_positions`,
    `tm`.`total_fastest_laps` as `total_fastest_laps`,
    `c`.`alpha2_code` as `alpha2_code`,
    `c`.`name` as `country`
from
    (`tyre_manufacturer` `tm`
join `country` `c` on
    ((`tm`.`country_id` = `c`.`id`)));