import { useDispatch, useSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { circuitsApi } from 'features/circuitsApi';
import { constructorsApi } from 'features/constructorsApi';
import { driversApi } from 'features/driversApi';
import { raceApi } from '@/features/raceApi';
import { sessionsApi } from 'features/sessionsApi';
import { standingsApi } from 'features/standingsApi';
import { userApi } from 'features/userApi';

import constructorsReducer from 'slices/constructorsSlice';
import driversReducer from 'slices/driversSlice';
import racesReducer from 'slices/racesSlice';
import routeSlice from 'slices/routeSlice';
import seasonApi from 'slices/seasonsSlice';
import siteWideSlice from 'slices/siteWideSlice';
import standingsReducer from 'slices/standingsSlice';

// ? WHAT IS THIS CRACK!?
/* The line `import { seasonsApi } from 'features/seasonsApi';` is importing the `seasonsApi` object
from the file located at `'features/seasonsApi'`. This object likely contains configurations and
functions related to making API calls or handling data related to seasons in the application. By
importing it, you can access and utilize the functionalities provided by the `seasonsApi` object
within your code. */
import { seasonsApi } from 'features/seasonsApi';

export type TAppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        [circuitsApi.reducerPath]: circuitsApi.reducer,
        [constructorsApi.reducerPath]: constructorsApi.reducer,
        [driversApi.reducerPath]: driversApi.reducer,
        [raceApi.reducerPath]: raceApi.reducer,
        [seasonsApi.reducerPath]: seasonsApi.reducer,
        [sessionsApi.reducerPath]: sessionsApi.reducer,
        [standingsApi.reducerPath]: standingsApi.reducer,
        [userApi.reducerPath]: userApi.reducer,

        constructors: constructorsReducer,
        currentRoute: routeSlice,
        drivers: driversReducer,
        races: racesReducer,
        seasons: seasonApi,
        siteWide: siteWideSlice,
        standings: standingsReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(circuitsApi.middleware)
            .concat(constructorsApi.middleware)
            .concat(driversApi.middleware)
            .concat(raceApi.middleware)
            .concat(seasonsApi.middleware)
            .concat(sessionsApi.middleware)
            .concat(standingsApi.middleware)
            .concat(userApi.middleware),
});

// Enable listeners behavior for refetchOnMount and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
