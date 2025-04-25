import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { F1SP_BASE_DB_URL } from 'constants/constants';

import { dbFetch } from 'utils/index';

export const seasonsApi = createApi({
    reducerPath: 'seasonsApi',
    baseQuery: fetchBaseQuery({ baseUrl: F1SP_BASE_DB_URL }),
    endpoints: (builder) => ({
        getConstructorSeasons: builder.query({
            queryFn: async (arg) => {
                const year = arg ?? 2024;
                const result = await dbFetch(`/standingsWithConstructors?year=${year}`);
                return { data: result };
            },
        }),
        getDriverSeasons: builder.query({
            queryFn: async (arg) => {
                const year = arg ?? 2024;
                const result = await dbFetch(`/standingsWithDrivers?year=${year}`);
                return { data: result };
            },
        }),
        getLatestSeasonYear: builder.query({
            /* @ts-expect-error -- will fix later */
            queryFn: async () => {
                const response = await dbFetch(`/seasonLatestYear`);
                console.log('result', response);

                if ('error' in response) {
                    return { error: response.error };
                }

                const year = response?.data?.year ?? 2024;
                return { data: year };
            },
        }),
        getSeasonStats: builder.query({
            queryFn: async () => {
                const result = await dbFetch(`/seasonStats`);
                return { data: result };
            },
        }),
    }),
});

export const {
    useGetConstructorSeasonsQuery,
    useGetDriverSeasonsQuery,
    useGetLatestSeasonYearQuery,
    useGetSeasonStatsQuery,
} = seasonsApi;
