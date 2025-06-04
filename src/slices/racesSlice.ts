import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RaceProps, RaceResultProps } from 'types/races';

export interface IState {
    lastRace: RaceProps | null;
    lastRaceId: number | null;
    lastRaceResults: RaceResultProps[] | null;
    lastRaceAtCircuit: RaceProps | null;
    previousResultsAtCircuit: RaceProps[] | null;
    raceNext: Partial<RaceProps> | null;
    races: RaceProps[];
    raceWGP: Partial<RaceProps> | null;
    totalRaceCount: number | 0;
}

const initialState: IState = {
    lastRace: null,
    lastRaceId: null,
    lastRaceResults: null,
    lastRaceAtCircuit: null,
    previousResultsAtCircuit: [],
    raceNext: null,
    races: [],
    raceWGP: null,
    totalRaceCount: 0,
};

const racesSlice = createSlice({
    name: 'races',

    initialState,

    reducers: {
        // setCircuitLastTime(state, action: PayloadAction<number | null>) {
        //     state.circuit = action.payload || null;
        // },
        setLastRaceResults(state, action: PayloadAction<RaceResultProps[]>) {
            state.lastRaceResults = action.payload;
        },
        setRaceNext(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceNext = action.payload;
        },
        setPreviousResultsAtCircuit(state, action: PayloadAction<RaceProps[] | null>) {
            state.previousResultsAtCircuit = action.payload || null;
        },
        setRaces(state, action: PayloadAction<RaceProps[]>) {
            state.races = action.payload || [];
        },
        setLastRaceId(state, action: PayloadAction<number | null>) {
            state.lastRaceId = action.payload || null;
        },
        setLastRaceAtCircuit(state, action: PayloadAction<RaceProps | null>) {
            state.lastRaceAtCircuit = action.payload || null;
        },
        setRaceWGP(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceWGP = action.payload || null;
        },
        setTotalRaceCount(state, action: PayloadAction<number>) {
            state.totalRaceCount = action.payload || 0;
        },
    },
});

export const {
    setLastRaceId,
    setLastRaceResults,
    setLastRaceAtCircuit,
    setPreviousResultsAtCircuit,
    setRaceNext,
    setRaceWGP,
    setRaces,
    setTotalRaceCount,
} = racesSlice.actions;

export default racesSlice.reducer;
