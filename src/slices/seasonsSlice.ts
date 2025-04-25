import { createSlice } from '@reduxjs/toolkit';
import type { ConstructorStanding, DriverStanding } from 'types/standings';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Season } from 'types/season';

interface IState {
    constructors: ConstructorStanding[];
    drivers: DriverStanding[];
    seasons: Season[];
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
        setConstructorSeasons: (state, action: PayloadAction<ConstructorStanding[]>) => {
            let payload = action.payload;

            if (!payload) payload = [];
            state.constructors = payload;
        },
        setDriverSeasons: (state, action: PayloadAction<DriverStanding[]>) => {
            state.drivers = action.payload;
        },
        setSeasonStats: (state, action: PayloadAction<Season[]>) => {
            state.seasons = action.payload;
        },
    },
});

export const { setConstructorSeasons, setDriverSeasons, setSeasonStats } = seasonsSlice.actions;

export default seasonsSlice.reducer;
