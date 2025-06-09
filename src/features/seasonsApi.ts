import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const seasonsApi = createApi({
    reducerPath: 'seasonsApi',
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        // getConstructorSeasons: builder.query({
        //     queryFn: async (arg) => {
        //         const year = arg ?? 2024;
        //         const result = await dbFetch(`/standingsWithConstructors?year=${year}`);
        //         return { data: result };
        //     },
        // }),
        // getDriverSeasons: builder.query({
        //     queryFn: async (arg) => {
        //         const year = arg ?? 2024;
        //         const result = await dbFetch(`/standingsWithDrivers?year=${year}`);
        //         return { data: result };
        //     },
        // }),
        /* getLastRaceResults: builder.query({
            query: (raceId: number) =>
                `raceResults?$orderby=position_display_order&$filter=race_id eq ${parseInt(raceId.toString(), 10)}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching last race results:', error);
            },
        }), */
        getSeasonStats: builder.query({
            query: (arg) => {
                console.log('---------- Fetching season stats for year:', arg);
                const year = arg ?? 2024;
                return year ? `/seasonStats?$orderby=year desc` : `/seasonStats?$orderby=year desc`;
            },
            transformResponse: (response) => {
                console.log('Season stats response:', response);
                // return response?.value ?? [];
                return response?.value || [];
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching season stats:', error);
                return { error: 'Failed to fetch season stats' };
            },
        }),
    }),
});

export const { /*useGetConstructorSeasonsQuery, useGetDriverSeasonsQuery,*/ useGetSeasonStatsQuery } = seasonsApi;
