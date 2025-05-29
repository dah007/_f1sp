-- f1sp.race_w_data source

create or replace
algorithm = UNDEFINED view `race_w_data` as
select
    (
    select
        `d2`.`name` as `sprint_winner`
    from
        (`race_data` `rd2`
    join `driver` `d2` on
        ((`rd2`.`driver_id` = `d2`.`id`)))
    where
        ((`rd2`.`type` = 'SPRINT_RACE_RESULT')
            and (`rd2`.`race_id` = `r`.`id`)
                and (`rd2`.`position_number` = 1))
    limit 1) as `sprint_winner`,
    (
    select
        `d3`.`name`
    from
        (`race_data` `rd`
    join `driver` `d3` on
        ((`rd`.`driver_id` = `d3`.`id`)))
    where
        ((`rd`.`type` = 'RACE_RESULT')
            and (`rd`.`race_id` = `r`.`id`)
                and (`rd`.`position_number` = 1))
    limit 1) as `race_winner`,
    `country`.`alpha2_code` as `alpha2_code`,
    `country`.`name` as `country_name`,
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
    c.longitude as longitude, c.latitude as latitude
    from
    ((`race` `r`
join `grand_prix` `gp` on
    ((`r`.`grand_prix_id` = `gp`.`id`)))
join `country` on
    ((`gp`.`country_id` = `country`.`id`)))
join `circuit` `c` on
	r.circuit_id = c.id
order by
    `r`.`year` desc,
    `r`.`round` desc;