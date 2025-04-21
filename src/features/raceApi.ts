import { REST_URL } from '@/constants/constants';
import { RaceProps } from '@/types/races';
import { dbFetch } from '@/utils';
// import { RaceProps, TotalWinsProps, TotalWinsYearProps } from '@/types/races';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { F1SP_BASE_DB_URL } from 'constants/constants';

// import { buildErrorObject, dbFetch } from 'utils/index';
// import { BASE_REST_URL, BASE_URL } from '@/constants/constants';

// const baseYear = new Date().getFullYear();

/**
 * Light reading on how to use OData queries:
 * https://learn.microsoft.com/en-us/azure/search/search-query-odata-filter
 * https://learn.microsoft.com/en-us/azure/search/search-filters
 */

export const raceApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    endpoints: (builder) => ({
        getNextRace: builder.query({
            queryFn: async (raceId: number | string = '') => {
                // try {
                const data = await dbFetch(`/raceNext`);
                console.log('data', data);
                debugger;
                return { data: data };
                // } catch (error) {
                //     return buildErrorObject(error);
                // }
            },
        }),
        // getNextRace: builder.query({
        //     query: () => 'raceNext',
        //     transformResponse: (response: { value: RaceProps }) => {
        //         console.log('response', response);
        //         return response?.value ?? {};
        //     },
        //     transformErrorResponse: (error) => {
        //         console.error('Error fetching next race results:', error);
        //         return error;
        //     },
        // }),
        /** @DEPRECATED */
        // getDriverOfTheDay: builder.query({
        //     queryFn: async () => {
        //         try {
        //             const data = await dbFetch(`/driver-of-day`);
        //             console.log('data', data);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getFastestLap: builder.query({
        //     queryFn: async (raceId: number | string = '') => {
        //         try {
        //             const data = await dbFetch(`/fastestLap?raceId=${raceId}`);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getFastestPitStop: builder.query({
        //     queryFn: async (raceId: number | string = '') => {
        //         try {
        //             const data = await dbFetch(`/fastestPitStop?raceId=${raceId}`);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),

        // getRaceLastRace: builder.query({
        //     query: () => 'race?$orderby=year%20desc&$first=1',
        //     transformResponse: (response: RaceProps) => response?.value ?? [],
        //     transformErrorResponse: (error) => {
        //         console.error('49 ??? Error fetching last race results:', error);
        //         return error;
        //     },
        // }),

        // getLastRaceResults: builder.query({
        //     query: () => `race_result`,
        //     transformResponse: (response: RaceProps) => {
        //         return response.value ?? [];
        //     },
        //     transformErrorResponse: (error) => {
        //         console.error('-----> Error fetching last race results:', error);
        //         return error;
        //     },
        // }),
        // getLastResultsAtCircuit: builder.query({
        //     query: (circuitId: string) =>
        //         `previousWinnersCircuit?$filter=circuit_id eq '${circuitId}'&$orderby=year desc`,
        //     transformResponse: (response: RaceProps) => response?.value ?? [],
        //     transformErrorResponse: (error) => {
        //         console.error('------> Error fetching last race results:', error);
        //         return error;
        //     },
        // }),

        // getPointsByRace: builder.query({
        //     query: (year: number = 2024) => `/pointsByRace?year=${year}`,
        // }),
        // getPollPosition: builder.query({
        //     queryFn: async (raceId: number | string = '') => {
        //         try {
        //             const data = await dbFetch(`/pollPosition?raceId=${raceId}`);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getRace: builder.query({
        //     queryFn: async (year: number = baseYear) => {
        //         try {
        //             const data = await dbFetch(`race?year=${year}`);
        //             return { data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getRaceMaxYear: builder.query({
        //     query: () => `race?$orderby=year%20desc&$first=1`,
        //     transformResponse: (response: RaceProps) => {
        //         return response.value ?? [];
        //     },
        //     transformErrorResponse: (error) => {
        //         console.error('Error fetching race max:', error);
        //         return error;
        //     },
        // }),
        // getRaceResultsPrevious: builder.query({
        //     queryFn: async (circuitId: string) => {
        //         try {
        //             const data = await dbFetch(`/getRaceLastResults?circuitId=${circuitId}`);
        //             return { data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getRaceResultsWithQual: builder.query({
        //     queryFn: async (id: string) => {
        //         try {
        //             const data = await dbFetch(`/raceResultsWithQual?id=${id}`);
        //             return { data: data.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getRacesResultsWithQual: builder.query({
        //     queryFn: async (year: number = baseYear) => {
        //         try {
        //             const results = await dbFetch(`/racesResultsWithQual?$filter=year eq ${year}`);
        //             return { data: results.data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        // getTotalWinsByYear: builder.query({
        //     query: (year: number) => `/totalWinsByYear?$filter=year eq ${year}`,
        //     transformResponse: (response: { value: TotalWinsYearProps }) => response?.value ?? [],
        //     transformErrorResponse: (error) => {
        //         console.error('------> Error fetching TOTAL wins by year:', error);
        //         return error;
        //     },
        // }),
        // getTotalWinsDriver: builder.query({
        //     query: (driverId: string) => `/totalWinsDrivers?$filter=driver_id eq '${driverId}'`,
        //     transformResponse: (response: { value: TotalWinsProps }) => response?.value ?? [],
        //     transformErrorResponse: (error) => {
        //         console.error('------> Error fetching TOTAL wins:', error);
        //         return error;
        //     },
        // }),

        // /**
        //  * @deprecated
        //  */
        // getRaceMaxId: builder.query({
        //     queryFn: async () => {
        //         try {
        //             const response = await fetch('race?$orderby=id%20desc&$first=1');
        //             const data = await response.json();
        //             return { data: data.value ? data.value[0] : null };
        //         } catch (error) {
        //             console.error('---- Error fetching race max id:', error);
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
    }),
});

export const {
    // useGetDriverOfTheDayQuery,
    // useGetFastestLapQuery,
    // useGetFastestPitStopQuery,
    // useGetLastRaceResultsQuery,
    // useGetLastResultsAtCircuitQuery,
    useGetNextRaceQuery,
    // useGetPointsByRaceQuery,
    // useGetPollPositionQuery,
    // useGetRaceLastRaceQuery,
    // useGetRaceMaxIdQuery /* @deprecated */,
    // useGetRaceMaxYearQuery,
    // useGetRaceQuery,
    // useGetRaceResultsPreviousQuery,
    // useGetRaceResultsWithQualQuery,
    // useGetRacesResultsWithQualQuery,
    // useGetTotalWinsByYearQuery,
    // useGetTotalWinsDriverQuery,
} = raceApi;
