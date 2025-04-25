import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Driver, DriverOfTheDay, TDriverPodiums, DriverStats, PositionData } from 'types/drivers';

interface DriversSliceProps {
    driver?: Driver;
    drivers?: Driver[];
    driversByYear?: Driver[];
    driversOfTheDay: DriverOfTheDay[];
    driverPositions?: PositionData[];
    podiumData?: TDriverPodiums;
    stats?: DriverStats;
    totalPositions?: PositionData[];
}

const initialState: DriversSliceProps = {
    driver: {} as Driver,
    drivers: [],
    driversOfTheDay: [] as DriverOfTheDay[],
    driverPositions: [],
    podiumData: {} as TDriverPodiums,
    stats: {} as DriverStats,
    totalPositions: [],
    driversByYear: [],
};

export const driversSlice = createSlice({
    name: 'drivers',
    initialState,
    reducers: {
        setDrivers: (state, action: PayloadAction<Driver[]>) => {
            state.drivers = action.payload || [];
        },
        setDriver: (state, action: PayloadAction<Driver>) => {
            let payload = action.payload;

            if (!payload) payload = {} as Driver;
            state.driver = payload;
        },
        setDriversByYear: (state, action: PayloadAction<Driver[]>) => {
            state.driversByYear = action.payload;
        },
        setDriversOfTheDay: (state, action: PayloadAction<DriverOfTheDay[]>) => {
            let payload = action.payload;

            if (!payload) payload = [];
            state.driversOfTheDay = payload;
        },
        setDriverPodiums: (state, action: PayloadAction<TDriverPodiums>) => {
            state.podiumData = action.payload;
        },
        setDriverPositions: (state, action: PayloadAction<PositionData[]>) => {
            state.driverPositions = action.payload;
        },
        setStats: (state, action: PayloadAction<DriverStats>) => {
            state.stats = action.payload;
        },
        setTotalPositions: (state, action: PayloadAction<PositionData[]>) => {
            // TODO: Why is this being set twice?
            state.driverPositions = action.payload;
            state.totalPositions = action.payload;
        },
        setTotalSeasons: (state, action: PayloadAction<number>) => {
            if (state.stats) {
                state.stats.totalSeasons = action.payload;
            } else {
                state.stats = {
                    totalSeasons: action.payload,
                    totalRaces: 0,
                    totalChampionships: 0,
                    podiums: 0,
                } as DriverStats;
            }
        },
    },
});

export const {
    setDriver,
    setDriverPodiums,
    setDrivers,
    setDriversByYear,
    setDriversOfTheDay,
    setStats,
    setTotalPositions,
} = driversSlice.actions;

export default driversSlice.reducer;
