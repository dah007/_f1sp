export interface VoteValueProps {
    blueTires: boolean;
    drivers?: string[]; // TODO: shouldn't be here, refactor out
    driversInCrash: { [key: string]: boolean } | string;
    fastestLap: string;
    finishOrder: Driver[] | string;
    firstLapCrash: boolean;
    greenTires: boolean;
    rain: boolean;
    reds: number;
    yellows: number;
    userId?: number; // TODO: shouldn't be here, refactor out
    email?: string; // TODO: shouldn't be here, refactor out
    passcode?: string; // TODO: shouldn't be here, refactor out
    raceId?: string;
}
