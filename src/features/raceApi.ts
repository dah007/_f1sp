import { REST_URL } from '@/constants/constants';
import { type NextRaceProps } from '@/types/races';
// import { buildErrorObject } from '@/utils';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Light reading on how to use OData queries:
 * https://learn.microsoft.com/en-us/azure/search/search-query-odata-filter
 * https://learn.microsoft.com/en-us/azure/search/search-filters
 */

export const raceApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: REST_URL,
    }),

    endpoints: (builder) => ({
        getNextRace: builder.query({
            query: () => 'raceNext',
            transformResponse: (response: { value: NextRaceProps }) => response?.value?.[0] ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching next race results:', error);
                return error;
            },
        }),
        getLastRaceResults: builder.query({
            query: (raceId: number) => `race_result?$filter=race_id eq ${parseInt((raceId - 1).toString(), 10)}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching last race results:', error);
            },
        }),
        getRaceWithGP: builder.query({
            query: (raceId: number) => `race_w_gp?$filter=id eq ${raceId}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value[0] ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching race with GP:', error);
            },
        }),
    }),
});

export const { useGetNextRaceQuery, useGetLastRaceResultsQuery, useGetRaceWithGPQuery } = raceApi;
