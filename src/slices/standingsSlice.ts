import type { ConstructorStanding, DriverStanding } from '@/types/standings';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
    constructors: ConstructorStanding[];
    drivers: DriverStanding[];
}

const initialState: IState = {
    constructors: [],
    drivers: [],
};

export const standingsSlice = createSlice({
    name: 'standings',
    initialState,
    reducers: {
        setConstructorStandings: (state, action: PayloadAction<ConstructorStanding[]>) => {
            let payload = action.payload;

            if (!payload) payload = [];
            state.constructors = payload;
        },
        setDriverStandings: (state, action: PayloadAction<DriverStanding[]>) => {
            state.drivers = action.payload;
        },
    },
});

export const { setConstructorStandings, setDriverStandings } = standingsSlice.actions;

export default standingsSlice.reducer;
