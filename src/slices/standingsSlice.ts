import { createSlice } from '@reduxjs/toolkit';
import type { IConstructorStanding, IDriverStanding } from '@/types/standings';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IState {
    constructors: IConstructorStanding[];
    drivers: IDriverStanding[];
}

const initialState: IState = {
    constructors: [],
    drivers: [],
};

export const standingsSlice = createSlice({
    name: 'standings',
    initialState,
    reducers: {
        setConstructorStandings: (state, action: PayloadAction<IConstructorStanding[]>) => {
            let payload = action.payload;

            if (!payload) payload = [];
            state.constructors = payload;
        },
        setDriverStandings: (state, action: PayloadAction<IDriverStanding[]>) => {
            state.drivers = action.payload;
        },
    },
});

export const { setConstructorStandings, setDriverStandings } = standingsSlice.actions;

export default standingsSlice.reducer;
