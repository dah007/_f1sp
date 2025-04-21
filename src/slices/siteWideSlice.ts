import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

interface SiteWideProps {
    error: boolean
    lastCrumb?: string;
    lastSeason?: number;
    raceMaxYear?: number;
    selectedYear: number;
}

const initialState: SiteWideProps = {
    error: false,
    lastCrumb: '',
    lastSeason: new Date().getFullYear() - 1,
    raceMaxYear: new Date().getFullYear(),
    selectedYear: new Date().getFullYear(),
};

export const siteWideSlice = createSlice({
    name: 'routeSlice',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<boolean>) => {
            const payload = action.payload;
            if (!payload) return;

            state.error = payload;
        },
        setLastCrumb: (state, action: PayloadAction<string>) => {
            const payload = action.payload;
            if (!payload) return;

            state.lastCrumb = payload;
        },
        setLastSeasonYear: (state, action: PayloadAction<number>) => {
            const payload = action.payload;
            if (!payload) return;

            state.lastSeason = payload;
        },
        setSelectedYear: (state, action: PayloadAction<number>) => {
            const payload = action.payload;
            if (!payload) return;

            state.selectedYear = payload;
        },
        setRaceMaxYear: (state, action: PayloadAction<number>) => {
            const payload = action.payload;
            if (!payload) return;

            state.raceMaxYear = payload;
        },
    },
});

export const { setError, setLastCrumb, setLastSeasonYear, setSelectedYear, setRaceMaxYear } = siteWideSlice.actions;

export default siteWideSlice.reducer;
