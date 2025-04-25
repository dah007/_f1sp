import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RaceResultProps, RaceProps, NextRaceProps } from 'types/races';

export interface IState {
    lastRace: RaceProps | null;
    lastRaceId: number | null;
    lastRaceResults: RaceResultProps[] | null;
    previousResultsAtCircuit: RaceProps | null;
    raceNext: NextRaceProps | null;
    races: RaceProps[];
    raceWGP: Partial<RaceProps> | null;
}

const initialState: IState = {
    lastRace: null,
    lastRaceId: null,
    lastRaceResults: null,
    previousResultsAtCircuit: null,
    raceNext: null,
    races: [],
    raceWGP: null,
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
        setRaceNext(state, action: PayloadAction<NextRaceProps>) {
            state.raceNext = action.payload;
        },
        setPreviousResultsAtCircuit(state, action: PayloadAction<RaceProps | null>) {
            state.previousResultsAtCircuit = action.payload || null;
        },
        setRaces(state, action: PayloadAction<RaceProps[]>) {
            state.races = action.payload || [];
        },
        setLastRaceId(state, action: PayloadAction<number | null>) {
            state.lastRaceId = action.payload || null;
        },
        setRaceWGP(state, action: PayloadAction<Partial<RaceProps> | null>) {
            state.raceWGP = action.payload || null;
        },
    },
});

export const { setLastRaceId, setLastRaceResults, setPreviousResultsAtCircuit, setRaceNext, setRaceWGP, setRaces } =
    racesSlice.actions;

export default racesSlice.reducer;
