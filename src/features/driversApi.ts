import { REST_URL, YEAR } from '@/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { buildErrorObject } from 'utils/index';

import type { Driver, DriverOfTheDayProps, TotalWinsByYear } from '@/types/drivers';

export const driversApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    tagTypes: ['Drivers'], // TODO: figure this out
    endpoints: (builder) => ({
        getDriverTotalPositions: builder.query({
            query: (id: string = 'lando-norris') => `/driverPositionTotals?id=${id}`,
            providesTags: (result, error, id) => {
                if (error) {
                    return [{ type: 'Drivers', id }];
                }
                return result ? [{ type: 'Drivers', id: id }] : [{ type: 'Drivers', id: id }];
            },
        }),
        getDriver: builder.query({
            query: (id: string = 'lando-norris') => `/driver?$filter=id eq '${id}'`,
            transformResponse: (response: { value: Driver[] }) => response.value,
        }),
        getDriverOfTheDay: builder.query({
            query: (race_id: number = 0) => {
                console.log('grDriverOfTheDay');

                return `/driverOfTheDay?$filter=race_id eq ${race_id}`;
            },
            transformResponse: (response: { value: DriverOfTheDayProps[] }) => {
                return response.value;
            },
            transformErrorResponse: (response) => {
                return buildErrorObject(response);
            },
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

        /** @deprecated */
        getDriverPodiums: builder.query({
            query: (driverId: string = 'lando-norris') => `/driverPodiums?id=${driverId}`,
        }),
        // getDriverStats: builder.query({
        //     queryFn: async (driverId: string = 'lando-norris') => {
        //         try {
        //             const data = await dbFetch(`/driverStats?id=${driverId}`);
        //             return { data: data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
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
    useGetDriverPodiumsQuery,
    useGetDriverQuery,
    useGetDriversQuery,
    useGetDriverTotalPositionsQuery,
    useGetDriverWinsQuery,
    useGetDriversByYearQuery,
    useGetTotalWinsByYearQuery,
} = driversApi;
