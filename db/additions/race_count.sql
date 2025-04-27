-- f1sp.race_count source

create or replace
algorithm = UNDEFINED view `race_count` as
select
    count(`race`.`id`) as `totalRaceCount`
from
    `race`;