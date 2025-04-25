-- f1sp.driver_w_standings source

create or replace
algorithm = UNDEFINED view `driver_w_standings` as
select
    `d`.`id` as `id`,
    `d`.`name` as `name`,
    `sds`.`year` as `year`,
    `sds`.`position_display_order` as `position_display_order`,
    `sds`.`position_number` as `position_number`,
    `sds`.`position_text` as `position_text`,
    `sds`.`driver_id` as `driver_id`,
    `sds`.`points` as `points`
from
    (`season_driver_standing` `sds`
join `driver` `d` on
    ((`sds`.`driver_id` = `d`.`id`)));