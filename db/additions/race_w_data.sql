
-- constructors_with_data
    SELECT  c.*, c2.alpha2_code, c2.name as country
            (select total()
    FROM    constructor c
    INNER JOIN country c2 
        ON c.country_id = c2.id
    INNER JOIN race_data rd 
        ON c.id = rd.constructor_id
    INNER JOIN race r
        ON rd.race_id = r.id
    WHERE 
    rd.type = 'RACE_RESULT'
    GROUP 
    BY c.id
    ORDER BY c.name;

select *  from  race_result


select
    `c`.`id` as `id`,
    `c`.`name` as `name`,
    `c`.`full_name` as `full_name`,
    `c`.`country_id` as `country_id`,
    `c`.`best_championship_position` as `best_championship_position`,
    `c`.`best_starting_grid_position` as `best_starting_grid_position`,
    `c`.`best_race_result` as `best_race_result`,
    `c`.`total_championship_wins` as `total_championship_wins`,
    `c`.`total_race_entries` as `total_race_entries`,
    `c`.`total_race_starts` as `total_race_starts`,
    `c`.`total_race_wins` as `total_race_wins`,
    `c`.`total_1_and_2_finishes` as `total_1_and_2_finishes`,
    `c`.`total_race_laps` as `total_race_laps`,
    `c`.`total_podiums` as `total_podiums`,
    `c`.`total_podium_races` as `total_podium_races`,
    `c`.`total_points` as `total_points`,
    `c`.`total_championship_points` as `total_championship_points`,
    `c`.`total_pole_positions` as `total_pole_positions`,
    `c`.`total_fastest_laps` as `total_fastest_laps`,
    `c2`.`alpha2_code` as `alpha2_code`,
    `c2`.`name` as `country`,
    `r`.`year` as `year`
from
    (((`constructor` `c`
join `country` `c2` on
    ((`c`.`country_id` = `c2`.`id`)))
join `race_data` `rd` on
    ((`c`.`id` = `rd`.`constructor_id`)))
join `race` `r` on
    ((`rd`.`race_id` = `r`.`id`)))
    
where
    (`rd`.`type` = 'RACE_RESULT')
group by
    `c`.`id`
order by
    `c`.`name`;


select
    count(`rr`.`constructor_id`) as `total`,
    c.name as constructor,
    `r`.`year` as `year`
from
    `race_result` `rr`
join `constructor` `c` on
    `rr`.`constructor_id` = `c`.`id`
join `race` `r` on
    `rr`.`race_id` = `r`.`id`
where
    `rr`.`position_number` = 1
group by
    `rr`.`constructor_id`,
    `r`.`year`
order by
    `year` desc,`total` desc