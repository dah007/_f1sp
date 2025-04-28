import { DriverStanding } from '@/types/standings';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REST_URL } from 'constants/constants';

import { buildErrorObject } from 'utils/index';

export const standingsApi = createApi({
    reducerPath: 'standingsApi',
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    endpoints: (builder) => ({
        getConstructorStandings: builder.query({
            query: (year: number = 2025) => `/standingsWithConstructors?year=${year}`,
            transformResponse: (response: { data: DriverStanding }) => response?.data ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching constructor standings:', error);
                return buildErrorObject(error);
            },
        }),
        getDriverStandings: builder.query({
            query: (year: number = 2024) =>
                `/standingsWithDrivers?$filter=year eq ${year}&$orderby=position_display_order`,
            transformResponse: (response: { value: DriverStanding }) => {
                console.log('Driver standings response:', response);
                return response?.value ?? [];
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching driver standings:', error);
                return buildErrorObject(error);
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
    }),
});

export const { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } = standingsApi;
