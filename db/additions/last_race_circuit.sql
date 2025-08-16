-- f1sp.last_race_circuit source

create or replace
algorithm = UNDEFINED view `last_race_circuit` as
SELECT *
FROM rr_w_driver rwd
WHERE rwd.race_id = (
    SELECT MAX(rwd2.id)
FROM results_w_data rwd2
WHERE rwd2.circuit_id = rwd.circuit_id
);