-- f1sp.previous_5_winners_circuit source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `previous_winners_circuit` AS
select
	c.id as circuit_id,
	c.name,	
    `r`.`year` AS `year`,
    `d`.`full_name` AS `full_name`,
    `d`.`permanent_number` AS `permanent_number`,
    `rr`.`time` AS `time`
from
    ((`race` `r`
join `race_result` `rr` on
    ((`r`.`id` = `rr`.`race_id`)))
join `driver` `d` on
    ((`rr`.`driver_id` = `d`.`id`)))
inner join circuit c on r.circuit_id = c.id
order by
    `r`.`year` desc, rr.position_display_order