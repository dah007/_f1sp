import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Season } from 'types/season';

interface FastestLapsByYear {
    year: number;
    name: string;
    fastest_laps: number;
}

interface TotalWinsBySeason {
    year: number;
    name: string;
    wins: number;
}

interface TotalDNFByYear {
    year: number;
    name: string;
    totalDNF: number;
}

interface IState {
    seasons: Season[];
    fastestLapsByYear: FastestLapsByYear[];
    totalWinsBySeason: TotalWinsBySeason[];
    totalConstructorsBySeason: TotalWinsBySeason[];
    totalDNFBySeason: TotalDNFByYear[];
}

const initialState: IState = {
    seasons: [],
    fastestLapsByYear: [],
    totalWinsBySeason: [],
    totalConstructorsBySeason: [],
    totalDNFBySeason: [],
};

export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        setSeasons: (state, action: PayloadAction<Season[]>) => {
            state.seasons = action.payload;
        },
        setFastestLapsByYear: (state, action: PayloadAction<FastestLapsByYear[]>) => {
            state.fastestLapsByYear = action.payload;
        },
        setTotalWinsBySeason: (state, action: PayloadAction<TotalWinsBySeason[]>) => {
            state.totalWinsBySeason = action.payload;
        },
        setTotalConstructorsBySeason: (state, action: PayloadAction<TotalWinsBySeason[]>) => {
            state.totalConstructorsBySeason = action.payload;
        },
        setTotalDNFBySeason: (state, action: PayloadAction<TotalDNFByYear[]>) => {
            state.totalDNFBySeason = action.payload;
        },
    },
});

export const {
    setSeasons,
    setFastestLapsByYear,
    setTotalWinsBySeason,
    setTotalConstructorsBySeason,
    setTotalDNFBySeason,
} = seasonsSlice.actions;

export default seasonsSlice.reducer;
