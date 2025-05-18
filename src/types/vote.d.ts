
export interface VoteValueProps {
    blueTires: boolean;
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
