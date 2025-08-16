-- f1sp.standings_w_drivers source

create or replace
algorithm = UNDEFINED view `standings_w_drivers` as
select
    dwc.constructor_id as team_name,
    `d`.`id` as `id`,
    `d`.`name` as `name`,
    `d`.`permanent_number` as `permanent_number`,
    `sds`.`year` as `year`,
    `sds`.`position_display_order` as `position_display_order`,
    `sds`.`position_number` as `position_number`,
    `sds`.`position_text` as `position_text`,
    `sds`.`driver_id` as `driver_id`,
    `sds`.`points` as `points`
from
    `season_driver_standing` `sds`
    join `driver` `d` on
    `sds`.`driver_id` = `d`.`id`
    join `driver_w_constructor_by_year` `dwc` on
    `d`.`id` = `dwc`.`driver_id`
        and sds.year = dwc.year
group by d.id, dwc.constructor_id, sds.`year`, sds.position_display_order;