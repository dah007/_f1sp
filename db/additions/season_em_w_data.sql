-- f1sp.season_em_w_data source

create or replace
algorithm = UNDEFINED view `season_em_w_data` as
select con.name as contructor_name,
        con.full_name as contructotor_full_name,
        see.year, em.name as engine_manufacturer,
        see.engine_manufacturer_id,
        c.name as country_name, c.alpha2_code,
        em.name as manufacturer_name,
        em.best_championship_position,
        em.best_starting_grid_position,
        em.best_race_result,
        em.total_championship_wins,
        em.total_race_entries,
        em.total_race_starts,
        em.total_race_wins,
        em.total_race_laps,
        em.total_podiums,
        em.total_podium_races,
        em.total_points,
        em.total_championship_points,
        em.total_pole_positions,
        em.total_fastest_laps
from season_entrant_engine see
        inner join engine_manufacturer em on see.engine_manufacturer_id = em.id
        inner join `engine ` e on see.engine_id = e.id
        inner join constructor con on see.constructor_id = con.id
        inner join country c on em.country_id = c.id
order by see.year desc, em.name;