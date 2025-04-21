-- f1sp.circuits_w_data source

create or replace
algorithm = UNDEFINED view `circuits_w_data` as
select
    `c`.`place_name` as `place_name`,
    `c`.`id` as `id`,
    `r`.`date` as `date`,
    date_format(`r`.`date`, '%e-%b-%y') as `raceDate`,
    `r`.`official_name` as `official_name`,
    `c`.`name` as `shortName`,
    `c`.`full_name` as `full_name`,
    `c`.`type` as `circuitType`,
    `cc`.`name` as `country`,
    `c`.`latitude` as `latitude`,
    `c`.`longitude` as `longitude`
from
    (((`circuit` `c`
left join `race` `r` on
    ((`c`.`id` = `r`.`circuit_id`)))
join `country` `cc` on
    ((`c`.`country_id` = `cc`.`id`)))
join (
    select
        `race`.`circuit_id` as `circuit_id`,
        max(`race`.`date`) as `max_date`
    from
        `race`
    group by
        `race`.`circuit_id`) `latest_race` on
    (((`r`.`circuit_id` = `latest_race`.`circuit_id`) and (`r`.`date` = `latest_race`.`max_date`))))
order by
    `c`.`place_name`,
    `r`.`date` desc;