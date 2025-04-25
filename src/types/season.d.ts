import { Location } from 'types'

// @deprecated ??
export interface Season {
    url: string
    total: string
    CircuitTable: {
        season: string
        Circuits: Circuit[]
    }
}
// @deprecated ??
export type Circuit = {
    circuitId: string
    circuitName: string
    Location: Location[]
    url: string
}

export interface ISeason {
    constructorChampion: string;
    constructorChampionPoints: number;
    constructorCount: number;
    constructorCountry: string;
    constructorEngine: string;
    constructorId: string;
    driverChampion: string;
    driverChampionId: string;
    driverChampionPoints: number;
    driverCount: number;
    driverNationality: string;
    raceCount: number;
    totalLaps: number;
    visible: boolean;
    year: number;
}
