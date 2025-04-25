import { DriverStanding } from '@/types/standings';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from 'constants/constants';

import { buildErrorObject, dbFetch } from 'utils/index';

export const standingsApi = createApi({
    reducerPath: 'standingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        getConstructorStandings: builder.query({
            query: (year: number = 2025) => `/standingsWithConstructors?year=${year}`,
            transformResponse: (response: { data: DriverStanding }) => response?.data ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching constructor standings:', error);
                return error;
            },
        }),
        getDriverStandings: builder.query({
            query: (year: number = 2024) => `/standingsWithDrivers?year=${year}`,
            transformResponse: (response: { data: DriverStanding }) => response?.data ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching driver standings:', error);
                return error;
            },
        }),

        // getConstructosrStandings: builder.query({
        //     queryFn: async (year: number = 2024) => {
        //         try {
        //             const data = await dbFetch(`/standingsWithConstructors?year=${year}`);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        getDlriverStandings: builder.query({
            queryFn: async (year: number = 2024) => {
                try {
                    const data = await dbFetch(`/standingsWithDrivers?year=${year}`);
                    return { data: data.data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
    }),
});

export const { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } = standingsApi;
