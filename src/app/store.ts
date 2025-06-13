import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';

// API imports
import { raceApi } from '@/features/raceApi';
import { circuitsApi } from 'features/circuitsApi';
import { constructorsApi } from 'features/constructorsApi';
import { driversApi } from 'features/driversApi';
import { seasonsApi } from 'features/seasonsApi';
import { standingsApi } from 'features/standingsApi';
import { userApi } from 'features/userApi';

// Slice imports
import constructorsReducer from 'slices/constructorsSlice';
import driversReducer from 'slices/driversSlice';
import racesReducer from 'slices/racesSlice';
import routeSlice from 'slices/routeSlice';
import seasonApi from 'slices/seasonsSlice';
import standingsReducer from 'slices/standingsSlice';
import systemWideReducer from 'slices/systemWideSlice';
import userReducer from 'slices/userSlice';

// Define API endpoints array
const apiEndpoints = [raceApi, circuitsApi, constructorsApi, driversApi, seasonsApi, standingsApi, userApi];

export const store = configureStore({
    reducer: {
        // API reducers
        [raceApi.reducerPath]: raceApi.reducer,
        [circuitsApi.reducerPath]: circuitsApi.reducer,
        [constructorsApi.reducerPath]: constructorsApi.reducer,
        [driversApi.reducerPath]: driversApi.reducer,
        [seasonsApi.reducerPath]: seasonsApi.reducer,
        [standingsApi.reducerPath]: standingsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,

        // Slice reducers
        constructors: constructorsReducer,
        currentRoute: routeSlice,
        drivers: driversReducer,
        races: racesReducer,
        seasons: seasonApi,
        standings: standingsReducer,
        systemWide: systemWideReducer, // Assuming this is the correct slice for system-wide state
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(...apiEndpoints.map((endpoint) => endpoint.middleware)),
});

// Enable listeners for RTK Query
setupListeners(store.dispatch);

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
    useSelector<RootState, TSelected>(selector);
