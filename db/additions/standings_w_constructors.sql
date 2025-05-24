-- f1sp.standings_w_constructors source

create or replace
algorithm = UNDEFINED view `standings_w_constructors` as
select
    `c`.`id` as `id`,
    `c`.`full_name` as `full_name`,
    `c`.`name` as `short_name`,
    `scs`.`year` as `year`,
    `scs`.`position_display_order` as `position_display_order`,
    `scs`.`position_number` as `position_number`,
    `scs`.`position_text` as `position_text`,
    `scs`.`constructor_id` as `constructor_id`,
    `scs`.`engine_manufacturer_id` as `engine_manufacturer_id`,
    `scs`.`points` as `points`
from
    (`season_constructor_standing` `scs`
join `constructor` `c` on
    ((`scs`.`constructor_id` = `c`.`id`)));