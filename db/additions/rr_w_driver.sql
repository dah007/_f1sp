-- f1sp.rr_w_driver source

create or replace
algorithm = UNDEFINED view `rr_w_driver` as
select	d.name, rr.*, r.year
from	race_result rr
inner join driver d on rr.driver_id = d.id 
inner join race r on rr.race_id = r.id
