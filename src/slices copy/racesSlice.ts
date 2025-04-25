import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RaceResultProps, RaceProps } from 'types/races';

export interface IState {
    lastRaceResults: RaceResultProps[] | null;
    previousResultsAtCircuit: RaceProps[] | null;
    raceNext: RaceProps | null;
    races: RaceProps[];
}

const initialState: IState = {
    lastRaceResults: null,
    previousResultsAtCircuit: null,
    raceNext: null,
    races: [],
};

const racesSlice = createSlice({
    name: 'races',

    initialState,

    reducers: {
        setLastRaceResults(state, action: PayloadAction<RaceResultProps[]>) {
            state.lastRaceResults = action.payload;
        },

        setRaceNext(state, action: PayloadAction<RaceProps>) {
            state.raceNext = action.payload;
        },

        setPreviousResultsAtCircuit(state, action: PayloadAction<RaceProps[] | null>) {
            state.previousResultsAtCircuit = action.payload || null;
        },        

        setRaces(state, action: PayloadAction<RaceProps[] | null>) {
            state.races = action.payload || [];
        },
    },
});

export const {
    setLastRaceResults, 
    setRaceNext, 
    setPreviousResultsAtCircuit, 
    setRaces 
} = racesSlice.actions;

export default racesSlice.reducer;
