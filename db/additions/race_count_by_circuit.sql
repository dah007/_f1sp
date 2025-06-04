-- f1sp.race_count_by_circuit source

create or replace
algorithm = UNDEFINED view `race_count_by_circuit` as
select
    count(`race`.`id`) as `totalRaceCount`,
    `race`.`circuit_id` as `circuit_id`
from
    `race`
group by
    `race`.`circuit_id`;