export type RaceProps = {
    [x: string]: string | number | boolean | null | undefined;
    circuit_id: string;
    circuit_type: string;
    constructor: string;
    countryCode: string;
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
    id: string;
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

export interface RaceResultProps extends RaceType {
    driver: string; // ? this should be deprecated, use full_name OR name instead
    driver_id: number;
    driver_number: string; // ? this should be deprecated, use permanent_number instead
    fastest_lap: number;
    full_name?: string;
    gap: string;
    grid_position_number: number;
    id: string;
    laps: number;
    name: string;
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
