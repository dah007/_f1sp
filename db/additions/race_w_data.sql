-- f1sp.race_w_data source

create or replace
algorithm = UNDEFINED view `race_w_data` as
select
    `d`.`name` as `driver`,
    `c`.`alpha2_code` as `alpha2_code`,
    `c`.`name` as `country_name`,
    `gp`.`full_name` as `full_name`,
    `gp`.`total_races_held` as `total_races_held`,
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
    `r`.`pre_qualifying_date` as `pre_qualifying_date`,
    `r`.`pre_qualifying_time` as `pre_qualifying_time`,
    `r`.`free_practice_1_date` as `free_practice_1_date`,
    `r`.`free_practice_1_time` as `free_practice_1_time`,
    `r`.`free_practice_2_date` as `free_practice_2_date`,
    `r`.`free_practice_2_time` as `free_practice_2_time`,
    `r`.`free_practice_3_date` as `free_practice_3_date`,
    `r`.`free_practice_3_time` as `free_practice_3_time`,
    `r`.`free_practice_4_date` as `free_practice_4_date`,
    `r`.`free_practice_4_time` as `free_practice_4_time`,
    `r`.`qualifying_1_date` as `qualifying_1_date`,
    `r`.`qualifying_1_time` as `qualifying_1_time`,
    `r`.`qualifying_2_date` as `qualifying_2_date`,
    `r`.`qualifying_2_time` as `qualifying_2_time`,
    `r`.`qualifying_date` as `qualifying_date`,
    `r`.`qualifying_time` as `qualifying_time`,
    `r`.`sprint_qualifying_date` as `sprint_qualifying_date`,
    `r`.`sprint_qualifying_time` as `sprint_qualifying_time`,
    `r`.`sprint_race_date` as `sprint_race_date`,
    `r`.`sprint_race_time` as `sprint_race_time`,
    `r`.`warming_up_date` as `warming_up_date`,
    `r`.`warming_up_time` as `warming_up_time`
from
    ((((`race_data` `rd`
join `race` `r` on
    ((`rd`.`race_id` = `r`.`id`)))
join `grand_prix` `gp` on
    ((`r`.`grand_prix_id` = `gp`.`id`)))
join `driver` `d` on
    ((`rd`.`driver_id` = `d`.`id`)))
join `country` `c` on
    ((`gp`.`country_id` = `c`.`id`)))
where
    ((`rd`.`type` = 'RACE_RESULT')
        and (`rd`.`position_number` = 1))
order by
    `gp`.`full_name`,
    `r`.`year` desc;