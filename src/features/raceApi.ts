import { REST_URL, YEAR } from '@/constants/constants';
import { NextLinkRaceProps } from '@/routes/Races';
import { FastestLap, RaceProps, type NextRaceProps } from '@/types/races';
import { buildErrorObject, dbFetch } from '@/utils';
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
        getFastestLap: builder.query({
            query: (raceId: number | string = '') => `/fastestLap?raceId=${raceId}`,
            transformResponse: (response: { value: FastestLap }) => response?.value ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching fastest lap:', error);
                return error;
            },
        }),
        getLastRaceResults: builder.query({
            query: (raceId: number) => `raceResult?$filter=race_id eq ${parseInt((raceId - 1).toString(), 10)}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching last race results:', error);
            },
        }),

        getNextRace: builder.query({
            query: () => 'raceNext',
            transformResponse: (response: { value: NextRaceProps }) => response?.value?.[0] ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching next race results:', error);
                return error;
            },
        }),
        getRaceWithGP: builder.query({
            query: (raceId: number) => `raceGP?$filter=id eq ${raceId}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value[0] ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching race with GP:', error);
            },
        }),
        getRaceCount: builder.query({
            query: () => `/raceCount`,
            transformResponse: (response: { value: RaceProps[] }) => {
                console.log('response?.value', response?.value[0].totalRaceCount);
                return response?.value[0].totalRaceCount ?? 0;
            },
            transformErrorResponse: (error) => {
                console.error('Error ', error);
                return error;
            },
        }),
        getRaces: builder.query({
            query: (year: number | undefined) => (year ? `/races?year=${year}` : `/races`),
            transformResponse: (response: NextLinkRaceProps) => response ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching races:', error);
                return error;
            },
        }),
        getNextPage: builder.query({
            query: (nextLink: string) => {
                console.log('nextLink', nextLink);
                const url = new URL(`/data-api/rest/races?${nextLink}`, `http://localhost:4280`);
                console.log('url', url);
                return url.href;
            },
            transformResponse: (response: { value: RaceProps[] }) => response ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching next page:', error);
                return error;
            },
        }),
        getRace: builder.query({
            query: (id: number) => (id > 0 ? `race?$filter=id eq ${id}` : `race`),
            transformResponse: (response: { value: RaceProps[] }) => response ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching race', error);
            },
        }),
        /*------------------------------------------------------------------ */
        getDriverOfTheDay: builder.query({
            queryFn: async () => {
                try {
                    const data = await dbFetch(`/driver-of-day`);
                    console.log('data', data);
                    return { data: data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        OLDgetFastestLap: builder.query({
            queryFn: async (raceId: number | string = '') => {
                try {
                    const data = await dbFetch(`/fastestLap?raceId=${raceId}`);
                    return { data: data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getFastestPitStop: builder.query({
            queryFn: async (raceId: number | string = '') => {
                try {
                    const data = await dbFetch(`/fastestPitStop?raceId=${raceId}`);
                    return { data: data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        // getLastRaceResults: builder.query({
        //     queryFn: async () => {
        //         console.log('getLastRaceResults??');
        //         try {
        //             console.log('getLastRaceResults');
        //             const returnData = await fetch('http://localhost:4280/data-api/rest/race-result/race_id/1127');
        //             console.log('returnData', returnData);
        //             return { data: returnData };
        //         } catch (error) {
        //             console.log('error', error);
        //             console.log('------------------------------------------------------------');
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        getLastResultsAtCircuit: builder.query({
            queryFn: async () => {
                try {
                    const returnData = await dbFetch('/previousResultsByCircuit');
                    return { data: returnData };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getRaceMaxYear: builder.query({
            queryFn: async () => {
                try {
                    const results = await dbFetch('/raceMaxYear');
                    return { data: results ?? [] };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getPointsByRace: builder.query({
            query: (year: number = 2024) => `/pointsByRace?year=${year}`,
        }),
        getPollPosition: builder.query({
            queryFn: async (raceId: number | string = '') => {
                try {
                    const data = await dbFetch(`/pollPosition?raceId=${raceId}`);
                    return { data: data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        // getRace: builder.query({
        //     queryFn: async (year: number = YEAR) => {
        //         try {
        //             const data = await dbFetch(`/race?year=${year}`);
        //             return { data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        getRaceNext: builder.query({
            queryFn: async (year: number) => {
                try {
                    const data = await dbFetch(`/raceNext?year=${year}`);
                    return { data: data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getRaceResultsPrevious: builder.query({
            queryFn: async (circuitId: string) => {
                try {
                    const data = await dbFetch(`/getRaceLastResults?circuitId=${circuitId}`);
                    return { data };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
        getRacesResultsWithQual: builder.query({
            query: (id: number) => `/raceResultsWithQual?$filter=id eq ${id}`,
            // queryFn: async (id: string) => {
            //     try {
            //         const data = await dbFetch(`/raceResultsWithQual?$filter=id eq ${id}`);
            //         return { data: data };
            //     } catch (error) {
            //         return buildErrorObject(error);
            //     }
            // },
        }),
        getRaceResultsWithQual: builder.query({
            query: (year: number = YEAR) => `/raceResult?$filter=year eq ${year}`,
            transformResponse: (response: { value: NextRaceProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error', error);
                return error;
            },
            // queryFn: async (year: number = YEAR) => {
            //     try {
            //         const results = await dbFetch(`/racesResultsWithQual?year=${year}`);
            //         return { data: results };
            //     } catch (error) {
            //         return buildErrorObject(error);
            //     }
            // },
        }),
        getTotalWins: builder.query({
            queryFn: async (year: number = YEAR) => {
                try {
                    const results = await dbFetch(`/totalWinsSeason?year=${year}`);
                    return { data: results };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
    }),
});

export const {
    useGetDriverOfTheDayQuery,
    useGetFastestLapQuery,
    useGetFastestPitStopQuery,
    useGetLastRaceResultsQuery,
    useGetLastResultsAtCircuitQuery,
    useGetNextPageQuery,
    useGetNextRaceQuery,
    useGetPointsByRaceQuery,
    useGetPollPositionQuery,
    useGetRaceCountQuery,
    useGetRaceMaxYearQuery,
    useGetRaceNextQuery,
    useGetRaceQuery,
    useGetRaceResultsPreviousQuery,
    useGetRaceResultsWithQualQuery,
    useGetRaceWithGPQuery,
    useGetRacesQuery,
    useGetRacesResultsWithQualQuery,
    useGetTotalWinsQuery,
} = raceApi;

// export const { useGetNextRaceQuery, useGetLastRaceResultsQuery, useGetRaceWithGPQuery } = raceApi;
