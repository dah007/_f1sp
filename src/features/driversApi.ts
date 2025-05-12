import { YEAR } from '@/constants/constants';
import { createApi } from '@reduxjs/toolkit/query/react';
import { buildErrorObject } from 'utils/index';

import type { Driver, DriverOfTheDayProps, TotalWinsByYear } from '@/types/drivers';
import { baseQueryWithRetry } from '@/utils/query';

export const driversApi = createApi({
    baseQuery: baseQueryWithRetry,
    tagTypes: ['Drivers'],
    endpoints: (builder) => ({
        getDriverTotalPositions: builder.query({
            query: (id: string = 'lando-norris') => `/driverPositionTotals?id=${id}`,
            providesTags: (_result, _error, id) => {
                return [{ type: 'Drivers' as const, id }];
            },
        }),
        getDriver: builder.query({
            query: (id: string = 'lando-norris') => `/driver?$filter=id eq '${id}'`,
            transformResponse: (response: { value: Driver[] }) => response.value,
        }),
        getDriverOfTheDay: builder.query({
            query: (race_id: number = 0) => `/driverOfTheDay?$filter=race_id eq ${race_id}`,
            transformResponse: (response: { value: DriverOfTheDayProps[] }) => response.value,
            transformErrorResponse: (response) => buildErrorObject(response),
        }),
        getDrivers: builder.query({
            query: (year: number = 2025) => `/drivers?$filter=year eq ${year}&$first=100`,
            transformResponse: (response: { value: Driver[] }) => {
                return response.value;
            },
            transformErrorResponse: (response) => {
                return buildErrorObject(response);
            },
        }),
        getDriversByYear: builder.query({
            query: (year: number = 2024) => `/drivers?$filter=year eq ${year}`,
            transformResponse: (response: { value: Driver[] }) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return buildErrorObject(response);
            },
        }),
        getDriverStandings: builder.query({
            query: (year: number = YEAR) => `/driverStandings?year=${year}`,
        }),

        /** @deprecated */
        getDriverWins: builder.query({
            query: (driverId: string = 'lando-norris') => `/driverWins?id=${driverId}`,
        }),
        getTotalWinsByYear: builder.query({
            query: (year: number = YEAR) => `totalWinsByYear/?$filter=year eq ${year}`,
            transformResponse: (response: { value: TotalWinsByYear[] }) => {
                return response.value;
            },
            transformErrorResponse: (response) => {
                return buildErrorObject(response);
            },
        }),
    }),
    reducerPath: 'driversApi',
});

export const {
    useGetDriverOfTheDayQuery,
    useGetDriverQuery,
    useGetDriversQuery,
    useGetDriverTotalPositionsQuery,
    useGetDriverWinsQuery,
    useGetDriversByYearQuery,
    useGetTotalWinsByYearQuery,
} = driversApi;
