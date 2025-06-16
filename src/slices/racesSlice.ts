import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RaceProps, RaceResultProps } from 'types/races';

export interface RacesState {
    lastRace: RaceProps | null;
    lastRaceId: number | null;
    lastRaceResults: RaceResultProps[] | null;
    lastRaceAtCircuit: RaceProps | null;
    previousResultsAtCircuit: RaceProps[] | null;
    raceDetails: Partial<RaceProps> | null;
    raceNext: Partial<RaceProps> | null;
    races: RaceProps[];
    raceWGP: Partial<RaceProps> | null;
    totalRaceCount: number;
}

const initialState: RacesState = {
    lastRace: null,
    lastRaceId: null,
    lastRaceResults: null,
    lastRaceAtCircuit: null,
    previousResultsAtCircuit: null,
    raceDetails: null,
    raceNext: null,
    races: [],
    raceWGP: null,
    totalRaceCount: 0,
};

const racesSlice = createSlice({
    name: 'races',
    initialState,
    reducers: {
        setLastRaceResults(state, action: PayloadAction<RaceResultProps[]>) {
            state.lastRaceResults = action.payload;
        },
        setRaceNext(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceNext = action.payload;
        },
        setRaces(state, action: PayloadAction<RaceProps[]>) {
            state.races = action.payload;
        },
        setRaceDetails(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceDetails = action.payload;
        },
        setLastRaceId(state, action: PayloadAction<number | null>) {
            state.lastRaceId = action.payload;
        },
        setLastRaceAtCircuit(state, action: PayloadAction<RaceProps | null>) {
            state.lastRaceAtCircuit = action.payload;
        },
        setRaceWGP(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceWGP = action.payload;
        },
        setTotalRaceCount(state, action: PayloadAction<number>) {
            state.totalRaceCount = action.payload;
        },
    },
});

export const {
    setLastRaceId,
    setLastRaceResults,
    setLastRaceAtCircuit,
    // setPreviousResultsAtCircuit,
    setRaceDetails,
    setRaceNext,
    setRaceWGP,
    setRaces,
    setTotalRaceCount,
} = racesSlice.actions;

export default racesSlice.reducer;
