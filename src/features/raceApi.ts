import { REST_URL } from '@/constants/constants';
import { RaceProps } from '@/types/races';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Light reading on how to use OData queries:
 * https://learn.microsoft.com/en-us/azure/search/search-query-odata-filter
 * https://learn.microsoft.com/en-us/azure/search/search-filters
 */

console.log(`http://localhost:4280${REST_URL}`);

export const raceApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:4280${REST_URL}` }),

    endpoints: (builder) => ({
        getNextRace: builder.query({
            query: () => 'raceNext',
            transformResponse: (response: { value: RaceProps }) => {
                console.log('response', response);
                return response?.value ?? {};
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching next race results:', error);
                return error;
            },
        }),
    }),
});

export const { useGetNextRaceQuery } = raceApi;
