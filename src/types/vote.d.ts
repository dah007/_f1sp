export interface VoteValueProps {
    blueTires: boolean;
    drivers?: string[]; // TODO: shouldn't be here, refactor out
    driversInCrash: { [key: string]: boolean };
    fastestLap: string;
    finishOrder: Driver[];
    firstLapCrash: boolean;
    greenTires: boolean;
    rain: boolean;
    reds: number;
    yellows: number;
    userId?: number;
    email?: string;
    passcode?: string;
    raceId?: string;
}
