export interface ConstructorStanding {
    cName: string;
    constructor_id: string;
    emName: string;
    full_name: string;
    engine_manufacturer_id: string;
    points: number;
    position_display_order: number;
    position_number: number;
    position_text: number;
    year: number;
}

export interface DriverStanding {
    driver_id: string;
    name: string;
    permanent_number: number;
    points: number;
    position_display_order: number;
    position_number: number;
    position_text: string;
    year: number;
    team_name: string;
    fill?: string;
}
