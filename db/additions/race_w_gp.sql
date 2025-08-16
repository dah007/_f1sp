-- f1sp.race_w_gp source
create
or
replace
    algorithm = UNDEFINED view `race_w_gp` as
select
    `r`.`id` as `id`,
    `r`.`official_name` as `official_name`,
    `r`.circuit_id as circuit_id,
    `gp`.`name` as `name`,
    `gp`.short_name as `short_name`,
    `r`.`year` as `year`,
    `r`.`date` as `date`,
    `r`.`time` as `time`,
    `r`.`round` as `round`,
        (
    select
        count(`race`.`id`)
    from
        `race`
    where
        (`race`.`year` = `r`.`year`)) as `total_rounds`,
    `r`.`circuit_type` as `circuit_type`,
    `r`.`distance` as `distance`,
    `r`.`course_length` as `course_length`,
    `r`.`laps` as `laps`,
    `cir`.`name` as `circuit_name`,
    `cir`.`longitude` as `longitude`,
    `cir`.`latitude` as `latitude`
from
    (
        `race` `r`
        join `grand_prix` `gp` on ((`r`.`grand_prix_id` = `gp`.`id`))
        join `circuit` `cir` on ((`r`.`circuit_id` = `cir`.`id`))
    )
order by `r`.`year`;