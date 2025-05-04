-- f1sp.race_next source

create or replace
algorithm = UNDEFINED view `race_next` as
select
    `r`.`id` as `id`,
    `r`.`circuit_id` as `circuit_id`,
    `r`.`date` as `date`,
    `r`.`official_name` as `official_name`,
    `r`.`grand_prix_id` as `grand_prix_id`,
    `gp`.`short_name` as `short_name`
from
    (`race` `r`
join `grand_prix` `gp` on
    ((`r`.`grand_prix_id` = `gp`.`id`)))
where
    (`r`.`date` > DATE_ADD(now(), INTERVAL -1 day))
limit 1;