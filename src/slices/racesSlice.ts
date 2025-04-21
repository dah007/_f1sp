import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RaceResultProps, RaceProps } from 'types/races';

export interface IState {
    lastRace: RaceProps | null;
    lastRaceId: number | null;
    lastRaceResults: RaceResultProps[] | null;
    previousResultsAtCircuit: RaceProps | null;
    raceNext: RaceProps | null;
    races: RaceProps[];
}

const initialState: IState = {
    lastRace: null,
    lastRaceId: null,
    lastRaceResults: null,
    previousResultsAtCircuit: null,
    raceNext: null,
    races: [],
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
        setRaceNext(state, action: PayloadAction<RaceProps>) {
            state.raceNext = action.payload;
        },
        setPreviousResultsAtCircuit(state, action: PayloadAction<RaceProps | null>) {
            state.previousResultsAtCircuit = action.payload || null;
        },
        setRaces(state, action: PayloadAction<RaceProps[] | null>) {
            state.races = action.payload || [];
        },
        setLastRaceId(state, action: PayloadAction<number | null>) {
            state.lastRaceId = action.payload || null;
        },
    },
});

export const { setLastRaceResults, setRaceNext, setPreviousResultsAtCircuit, setRaces, setLastRaceId } =
    racesSlice.actions;

export default racesSlice.reducer;
