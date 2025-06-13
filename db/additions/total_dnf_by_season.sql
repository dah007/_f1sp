-- f1sp.total_dnf_by_season source

create or replace
algorithm = UNDEFINED view `total_dnf_by_season` as
select
    count(0) as `totalDNF`,
    `d`.`name` as `name`,
    `r`.`year` as `year`
from
    ((`race_result` `rr`
join `race` `r` on
    ((`rr`.`race_id` = `r`.`id`)))
join `driver` `d` on
    ((`rr`.`driver_id` = `d`.`id`)))
where
    (`rr`.`position_text` = 'DNF')
group by
    `r`.`year`,
    `d`.`name`
order by
    `r`.`year` desc,
    `totalDNF` desc;