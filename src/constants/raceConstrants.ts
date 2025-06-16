import { store } from '@/app/store';
import { raceApi } from '@/features/raceApi';
import { RaceProps } from '@/types/races';

/*
export const selectDriversData = driversApi.endpoints.getDrivers.select(YEAR);

// Access the data from the store's state
const state = store.getState();
const driversResult = selectDriversData(state);

// The data is in driversResult.data
const drivers = driversResult?.data;
console.log('----------- drivers', drivers);
*/

export const selectRacesData = raceApi.endpoints.getRaces.select(1);

// Access the data from the store's state
const state = store.getState();
const racesResult = selectRacesData(state);

// The data is in racesResult.value
const races = racesResult?.value;
console.log('----------- races', races);

export const RACES_BY_ID =
    races && typeof races === 'object' ? Object.fromEntries(races?.map((race: RaceProps) => [race.id, race])) : {};
