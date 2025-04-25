// ?
// TODO: this type needs to be parsed down
export type Driver = {
    abbreviation: string;
    alpha2_code: string;
    best_championship_position: number;
    best_race_result: number;
    best_starting_grid_position: number;
    country_of_birth_country_id: string;
    date_of_birth: string;
    date_of_death: string | null;
    field?: string;
    first_name: string;
    formatted_dob: string;
    full_name: string;
    gender: string;
    id: string;
    last_name: string;
    name: string;
    nationality_country_id: string;
    permanent_number: string;
    place_of_birth: string;
    second_nationality_country_id: string | null;
    total_championship_points: number;
    total_championship_wins: number;
    total_driver_of_the_day: number;
    total_fastest_laps: number;
    total_grand_slams: number;
    total_podiums: number;
    total_points: number;
    total_pole_positions: number;
    total_race_entries: number;
    total_race_laps: number;
    total_race_starts: number;
    total_race_wins: number;
    url: string;
};

export interface DriverCheckboxProps {
    disabled: boolean;
    driver: Driver;
    drivers?: Driver[];
    index: number;
    voteValues: VoteValueProps;
    updateVoteValues: (value: Partial<VoteValueProps>) => void;
}

export type TDriverPodiums = {
    total1st: number;
    total2nd: number;
    total3rd: number;
};

export type DriverStats = {
    totalRaces: number;
    totalSeasons: number;
    totalChampionships: number;
    podiums: number;
};

export type DriverOfTheDay = {
    constructor_id: string;
    id: string;
    driver_number: string;
    engine_manufacturer_id: string;
    full_name: string;
    percentage: number;
    permanent_number: string;
    position_display_order: number;
    position_number: number;
    position_text: string;
    race_id: string;
    round: number;
    tyre_manufacturer_id?: string;
    year: number;
};

export type PositionData = {
    count: number;
    position_number: number | null;
};
