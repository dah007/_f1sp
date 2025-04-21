-- f1sp.driver_w_standings source

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `driver_w_standings` AS
select
    `d`.`name` AS `name`,
    `sds`.`year` AS `year`,
    `sds`.`position_display_order` AS `position_display_order`,
    `sds`.`position_number` AS `position_number`,
    `sds`.`position_text` AS `position_text`,
    `sds`.`driver_id` AS `driver_id`,
    `sds`.`points` AS `points`
from
    (`season_driver_standing` `sds`
join `driver` `d` on
    ((`sds`.`driver_id` = `d`.`id`)));