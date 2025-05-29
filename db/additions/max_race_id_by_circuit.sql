-- f1sp.max_race_id_by_circuit source

create or replace
algorithm = UNDEFINED view `max_race_id_by_circuit` as
select
    max(`r`.`id`) as `max_race_id`,
    `r`.`circuit_id` as `circuit_id`
from
    (`race` `r`
join `race_data` `rd` on
    ((`r`.`id` = `rd`.`race_id`)))
where
    (`rd`.`type` = 'RACE_RESULT')
group by
    `r`.`circuit_id`;