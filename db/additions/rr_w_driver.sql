-- f1sp.rr_w_driver source

create or replace
algorithm = UNDEFINED view `rr_w_driver` as
select
	d.name driver_name,
	d.country_of_birth_country_id countryId,
	rr.*, r.year, r.circuit_id
from race_result rr
	inner join driver d on rr.driver_id = d.id
	inner join race r on rr.race_id = r.id;
