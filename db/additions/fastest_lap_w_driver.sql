-- f1sp.fastest_lap_w_driver source

create or replace
algorithm = UNDEFINED view `fastest_lap_w_driver` as
select
    `d`.`first_name` as `first_name`,
    `d`.`name` as `driver`,
    `d`.`last_name` as `last_name`,
    `fl`.`race_id` as `race_id`,
    `fl`.`position_display_order` as `position_display_order`,
    `fl`.`position_number` as `position_number`,
    `fl`.`position_text` as `position_text`,
    `fl`.`driver_number` as `driver_number`,
    `fl`.`driver_id` as `driver_id`,
    `fl`.`constructor_id` as `constructor_id`,
    `fl`.`engine_manufacturer_id` as `engine_manufacturer_id`,
    `fl`.`tyre_manufacturer_id` as `tyre_manufacturer_id`,
    `fl`.`lap` as `lap`,
    `fl`.`time` as `time`,
    `fl`.`time_millis` as `time_millis`,
    `fl`.`gap` as `gap`,
    `fl`.`gap_millis` as `gap_millis`,
    `fl`.`interval` as `interval`,
    `fl`.`interval_millis` as `interval_millis`
from
    (`fastest_lap` `fl`
join `driver` `d` on
    ((`d`.`id` = `fl`.`driver_id`)));