import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SystemWideState {
    error: boolean;
    lastCrumb: string;
    lastSeason: number;
    loading: boolean;
    raceMaxYear: number;
    selectedYear: number;
}

const initialState: SystemWideState = {
    error: false,
    lastCrumb: '',
    lastSeason: new Date().getFullYear() - 1,
    loading: false,
    raceMaxYear: new Date().getFullYear(),
    selectedYear: new Date().getFullYear(),
};

export const systemWideSlice = createSlice({
    name: 'systemWide',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<boolean>) => {
            state.error = action.payload;
        },
        setLastCrumb: (state, action: PayloadAction<string>) => {
            state.lastCrumb = action.payload;
        },
        setLastSeasonYear: (state, action: PayloadAction<number>) => {
            state.lastSeason = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSelectedYear: (state, action: PayloadAction<number>) => {
            state.selectedYear = action.payload;
        },
        setRaceMaxYear: (state, action: PayloadAction<number>) => {
            state.raceMaxYear = action.payload;
        },
    },
});

export const { setError, setLastCrumb, setLastSeasonYear, setLoading, setSelectedYear, setRaceMaxYear } =
    systemWideSlice.actions;

export default systemWideSlice.reducer;
