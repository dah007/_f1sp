import { DriverStanding } from '@/types/standings';
import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

import { buildErrorObject } from 'utils/index';

export const standingsApi = createApi({
    reducerPath: 'standingsApi',
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getConstructorStandings: builder.query({
            query: (year: number = 2025) =>
                `/standingsWithConstructors?$filter=year eq ${year}&$orderby=position_display_order`,
            transformResponse: (response: { value: DriverStanding }) => {
                console.log('Constructor standings response:', response.value);
                return response?.value ?? [];
            },
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
    }),
});

export const { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } = standingsApi;
