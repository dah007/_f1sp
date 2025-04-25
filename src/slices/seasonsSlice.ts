import { createSlice } from '@reduxjs/toolkit';
import type { IConstructorStanding, IDriverStanding } from 'types/standings';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ISeason } from 'types/season';

interface IState {
    constructors: IConstructorStanding[];
    drivers: IDriverStanding[];
    seasons: ISeason[];
}

const initialState: IState = {
    constructors: [],
    drivers: [],
    seasons: [],
};

export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        setConstructorSeasons: (
            state,
            action: PayloadAction<IConstructorStanding[]>,
        ) => {
            let payload = action.payload;

            if (!payload) payload = [];
            state.constructors = payload;
        },
        setDriverSeasons: (state, action: PayloadAction<IDriverStanding[]>) => {
            state.drivers = action.payload;
        },
        setSeasonStats: (state, action: PayloadAction<ISeason[]>) => {
            state.seasons = action.payload;
        },
    },
});

export const { 
    setConstructorSeasons, 
    setDriverSeasons, 
    setSeasonStats,
} = seasonsSlice.actions;

export default seasonsSlice.reducer;
