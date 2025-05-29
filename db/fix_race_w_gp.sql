-- Fix for race_w_gp view to include longitude and latitude
DROP VIEW IF EXISTS `race_w_gp`;

CREATE
OR
REPLACE
    ALGORITHM = UNDEFINED VIEW `race_w_gp` AS
SELECT
    `r`.`id` AS `id`,
    `r`.`official_name` AS `official_name`,
    `r`.`circuit_id` AS `circuit_id`,
    `gp`.`name` AS `name`,
    `gp`.`short_name` AS `short_name`,
    `r`.`year` AS `year`,
    `r`.`date` AS `date`,
    `r`.`time` AS `time`,
    `r`.`round` AS `round`,
    `r`.`circuit_type` AS `circuit_type`,
    `r`.`distance` AS `distance`,
    `r`.`course_length` AS `course_length`,
    `r`.`laps` AS `laps`,
    `cir`.`name` AS `circuit_name`,
    `cir`.`longitude` AS `longitude`,
    `cir`.`latitude` AS `latitude`
FROM
    (
        `race` `r`
        JOIN `grand_prix` `gp` ON ((`r`.`grand_prix_id` = `gp`.`id`))
        JOIN `circuit` `cir` ON ((`r`.`circuit_id` = `cir`.`id`))
    );