-- f1sp.race_w_gp source

create or replace
algorithm = UNDEFINED view `race_w_gp` as
select
    `r`.id as `id`,
    `r`.`official_name` as `official_name`,
    `gp`.`name` as `name`,
    `r`.`year` as `year`
from
    (`race` `r`
join `grand_prix` `gp` on
    ((`r`.`grand_prix_id` = `gp`.`id`)));