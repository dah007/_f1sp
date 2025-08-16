

-- f1sp.race_next source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `race_next` AS
select
    r.id as id,
    `r`.`circuit_id` AS `circuit_id`,
    `r`.`date` AS `date
`,
    `r`.`official_name` AS `official_name`,
    `r`.`grand_prix_id` AS `grand_prix_id`,
    `gp`.`short_name` AS `short_name`
from
(`race` `r`
join `grand_prix` `gp` on
((`r`.`grand_prix_id` = `gp`.`id`)))
where
(`r`.`date` > now
())
limit 1;