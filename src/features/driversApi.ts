import { REST_URL } from '@/constants/constants';
import { Driver } from '@/types/drivers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { buildErrorObject, dbFetch } from 'utils/index';

export const driversApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    tagTypes: ['Drivers'], // TODO: figure this out
    endpoints: (builder) => ({
        getDriverOfDay: builder.query({
            query: (id: string = 'lando-norris') => `/driverOfDay?raceId=${id}`,
        }),
        getDriverTotalPositions: builder.query({
            query: (id: string = 'lando-norris') => `/driverPositionTotals?id=${id}`,
        }),
        getDriver: builder.query({
            query: (id: string = 'lando-norris') => `/driver?id=${id}`,
        }),
        getDrivers: builder.query({
            query: (year: number = 2024) => `/drivers?$filter=year eq ${year}`,
            transformResponse: (response: { value: Driver[] }) => {
                // const drivers = response.data.map((driver: any) => ({
                //     ...driver,
                //     name: `${driver.givenName} ${driver.familyName}`,
                // }));
                return response.value;
            },
        }),
        getDriversByYear: builder.query({
            queryFn: async (year: number = 2024) => {
                try {
                    const data = await dbFetch(`/driversByYear?year=${year}`);
                    console.log('data:', data);
                    return { data: data.data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getDriversByIds: builder.query({
            queryFn: async (drivers: string[]) => {
                const ids = drivers.join(',');
                const result = await dbFetch(`driversByIds?ids=${ids}`);
                console.log('result:', result);
                return { data: result.data[0] };
            },
        }),
        getDriverPodiums: builder.query({
            query: (driverId: string = 'lando-norris') => `/driverPodiums?id=${driverId}`,
        }),
        getDriverStats: builder.query({
            queryFn: async (driverId: string = 'lando-norris') => {
                try {
                    const data = await dbFetch(`/driverStats?id=${driverId}`);
                    return { data: data.data[0] };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getDriverStandings: builder.query({
            query: (year: string = '2024') => `/driver_w_standings?year=${year}`,
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
    useGetDriverStatsQuery,
    useGetDriverTotalPositionsQuery,
    useGetDriverWinsQuery,
    useGetDriversByIdsQuery,
    useGetDriversByYearQuery,
    useGetDriversQuery,
} = driversApi;
