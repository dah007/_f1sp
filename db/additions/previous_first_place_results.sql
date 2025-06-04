-- f1sp.previous_first_place_results source

create or replace
algorithm = UNDEFINED view `previous_first_place_results` as
select
    `c2`.`name` as `race_country`,
    `d`.`name` as `driver`,
    `rr`.`driver_id` as `driver_id`,
    `r`.`id` as `id`,
    `r`.`year` as `year`,
    `r`.`round` as `round`,
    `r`.`date` as `date`,
    `r`.`time` as `time`,
    `r`.`grand_prix_id` as `grand_prix_id`,
    `r`.`official_name` as `official_name`,
    `r`.`qualifying_format` as `qualifying_format`,
    `r`.`sprint_qualifying_format` as `sprint_qualifying_format`,
    `r`.`circuit_id` as `circuit_id`,
    `r`.`circuit_type` as `circuit_type`,
    `r`.`direction` as `direction`,
    `r`.`course_length` as `course_length`,
    `r`.`turns` as `turns`,
    `r`.`laps` as `laps`,
    `r`.`distance` as `distance`,
    `r`.`scheduled_laps` as `scheduled_laps`,
    `r`.`scheduled_distance` as `scheduled_distance`,
    `r`.`drivers_championship_decider` as `drivers_championship_decider`,
    `r`.`constructors_championship_decider` as `constructors_championship_decider`,
    `r`.`sprint_qualifying_date` as `sprint_qualifying_date`,
    `r`.`sprint_qualifying_time` as `sprint_qualifying_time`,
    `r`.`sprint_race_date` as `sprint_race_date`,
    `r`.`sprint_race_time` as `sprint_race_time`,
    `c`.`alpha2_code` as `driverNationality`,
    `rr`.`gap` as `gap`,
    `rr`.`gap_millis` as `gap_millis`,
    `rr`.`time` as `result_time`
from
    (((((`race_result` `rr`
join `race` `r` on
    ((`r`.`id` = `rr`.`race_id`)))
join `driver` `d` on
    ((`rr`.`driver_id` = `d`.`id`)))
join `circuit` `cir` on
    ((`r`.`circuit_id` = `cir`.`id`)))
join `country` `c` on
    ((`d`.`country_of_birth_country_id` = `c`.`id`)))
join `country` `c2` on
    ((`cir`.`country_id` = `c2`.`id`)))
where
    (`rr`.`position_number` = 1)
order by
    `r`.`year` desc,
    `r`.`id` desc;