-- f1sp.race_winner source

create or replace
algorithm = UNDEFINED view `race_winner` as
select
	d.name,
    r.id AS race_id,
    r.official_name AS race_name,
    r.date    
FROM race_result rr
JOIN driver d ON rr.driver_id = d.id
JOIN race r ON rr.race_id = r.id
WHERE rr.position_number = 1;