/**
 * Interface representing the fastest lap data of a race.
 * @interface FastestLap
 * @property {number} gap_millis - The gap to the leader in milliseconds.
 * @property {number} interval_millis - The interval to the car ahead in milliseconds.
 * @property {number} lap - The lap number when the fastest lap was recorded.
 * @property {number} position_display_order - The order in which the position should be displayed.
 * @property {number} position_number - The numerical position.
 * @property {number} race_id - The identifier of the race.
 * @property {number} time_millis - The lap time in milliseconds.
 * @property {string} constructor_id - The identifier of the constructor/team.
 * @property {string} driver - The full name of the driver.
 * @property {string} driver_id - The identifier of the driver.
 * @property {string} driver_number - The number of the driver.
 * @property {string} engine_manufacturer_id - The identifier of the engine manufacturer.
 * @property {string} first_name - The first name of the driver.
 * @property {string} gap - The gap to the leader as a string.
 * @property {string} interval - The interval to the car ahead as a string.
 * @property {string} last_name - The last name of the driver.
 * @property {string} position_text - The textual representation of the position.
 * @property {string} time - The lap time as a string.
 * @property {string} tyre_manufacturer_id - The identifier of the tyre manufacturer.
 */
export interface FastestLap {
    constructor_id: string;
    driver?: string;
    driver_id: string;
    driver_number: string;
    engine_manufacturer_id: string;
    first_name: string;
    gap: string;
    gap_millis: number;
    interval: string;
    interval_millis: number;
    lap: number;
    last_name: string;
    name?: string;
    position_display_order: number;
    position_number: number;
    position_text: string;
    race_id: number;
    time: string;
    time_millis: number;
    tyre_manufacturer_id: string;
}

export type PolePosition = {
    permanent_number?: number;
    driver: string;
};

export type RaceProps = {
    [x: string]: string | number | boolean | null | undefined;
    circuit_id: string;
    circuit_type: string;
    constructor: string;
    countryCode: string;
    country_of_birth_country_id?: string;
    course_length: number;
    date: string;
    distance: number;
    driverName?: string;
    driverNationality: string;
    free_practice_1_date: string | null;
    free_practice_1_time: string | null;
    free_practice_2_date: string | null;
    free_practice_2_time: string | null;
    free_practice_3_date: string | null;
    free_practice_3_time: string | null;
    free_practice_4_date: string | null;
    free_practice_4_time: string | null;
    grand_prix_id: string;
    id: number;
    laps: number;
    official_name: string;
    permanent_number: number;
    permanent_number?: number | null;
    place_name: sting;
    place_name: string;
    position_number?: number;
    pre_qualifying_date: string | null;
    pre_qualifying_time: string | null;
    qualDisplayOrder: number;
    qualifying_1_date: string | null;
    qualifying_1_time: string | null;
    qualifying_2_date: string | null;
    qualifying_2_time: string | null;
    qualifying_date: string | null;
    qualifying_format: string;
    qualifying_q1: string | null;
    qualifying_q2: string | null;
    qualifying_q3: string | null;
    qualifying_time: string | null;
    raceDisplayOrder: number;
    raceName: string;
    race_gap: string | null;
    race_points: number;
    race_time: string | null;
    round: number;
    scheduled_distance: number | null;
    scheduled_laps: number | null;
    sprint_qualifying_date: null;
    sprint_qualifying_format: string | null;
    sprint_qualifying_time: null;
    sprint_race_date: null;
    sprint_race_time: null;
    startDateTime?: string | undefined;
    time: string | null;
    warming_up_date: null;
    warming_up_time: null;
    year?: number | string | null;
};

export interface RaceResultProps extends RaceProps {
    circuit_id: string;
    circuit_name: string;
    date: string;
    driver: string; // ? this should be deprecated, use driver_name
    driver_country_code: string; // ? this should be deprecated, use driverNationality
    driver_id: string;
    driver_name: string; // ? name and full name should go, this is the only one that is clean
    driver_id: number;
    driver_number: string; // ? this should be deprecated, use permanent_number instead
    fastest_lap: number;
    full_name?: string;
    gap: string;
    grid_position_number: number;
    id: number;
    laps: number;
    name: string;
    official_name?: string;
    permanent_number?: number;
    pit_stops: number;
    points: number | null;
    position_display_order: number;
    position_number: number;
    position_text: string;
    positions_gained: number;
    raceName: string;
    round: number;
    short_name?: string;
    time: string;
    year: number;
}

export type TPreviousWinner = {
    circuitName: string;
    full_name: string;
    id: string;
    permanent_number?: number;
    race_driver_of_the_day?: boolean;
    race_fastest_lap?: boolean;
    race_time?: string;
    year: number;
    race_time: string;
    race_fastest_lap: boolean;
    race_driver_of_the_day: boolean;
    race_fastest_lap: boolean;
    race_time: string;
    year: number;
};

export interface TotalWinsProps {
    driver_id: string;
    name: string;
    points: number;
    position_display_order: number;
    position_number: number;
    position_text: string;
    year: number;
}

export interface TotalWinsYearProps {
    total: number;
    name: string;
    id: string;
}

export type RaceNextProps = Partial<RaceProps> & {
    circuit_id: string;
    official_name: string;
    short_name?: string;
    date: string;
    grand_prix_id: string;
    id: number;
};
