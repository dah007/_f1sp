import { REST_URL } from '@/constants/constants';
import { Driver } from '@/types/drivers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { buildErrorObject } from 'utils/index';

export const driversApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    tagTypes: ['Drivers'], // TODO: figure this out
    endpoints: (builder) => ({
        getDriverOfDay: builder.query({
            query: (id: string = 'lando-norris') => `/driverOfDay?raceId=${id}`,
        }),
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
        getDrivers: builder.query({
            query: (year: number = 2025) => `/drivers?$filter=year eq ${year}&$first=100`,
            transformResponse: (response: { value: Driver[] }) => {
                // const drivers = response.data.map((driver: any) => ({
                //     ...driver,
                //     name: `${driver.givenName} ${driver.familyName}`,
                // }));
                console.log('drivers:', response);
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
        // getDriversByIds: builder.query({
        //     queryFn: async (drivers: string[]) => {
        //         const ids = drivers.join(',');
        //         const result = await dbFetch(`driversByIds?ids=${ids}`);
        //         console.log('result:', result);
        //         return { data: result };
        //     },
        // }),
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
            query: (year: string = '2024') => `/driverStandings?year=${year}`,
        }),

        getDriverWins: builder.query({
            query: (driverId: string = 'lando-norris') => `/driverWins?id=${driverId}`,
        }),
    }),
    reducerPath: 'driversApi',
});

export const {
    useGetDriverOfDayQuery,
    useGetDriverPodiumsQuery,
    useGetDriverQuery,
    // useGetDriverStatsQuery,
    useGetDriverTotalPositionsQuery,
    useGetDriverWinsQuery,
    // useGetDriversByIdsQuery,
    useGetDriversByYearQuery,
    useGetDriversQuery,
} = driversApi;
