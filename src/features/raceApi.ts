import { YEAR } from '@/constants/constants';
import { NextLinkRaceProps } from '@/routes/RacesRoute';
import { FastestLap, RaceProps, type RaceNextProps } from '@/types/races';
import { baseQueryWithRetry } from '@/utils/query';
// import { buildErrorObject } from '@/utils';

import { createApi } from '@reduxjs/toolkit/query/react';

/**
 * Light reading on how to use OData queries:
 * https://learn.microsoft.com/en-us/azure/search/search-query-odata-filter
 * https://learn.microsoft.com/en-us/azure/search/search-filters
 */

export const raceApi = createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getFastestLap: builder.query({
            query: (raceId: number) => `/fastestLap?$filter=race_id eq ${raceId}`,
            transformResponse: (response: { value: FastestLap[] }) => response?.value[0] ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching fastest lap:', error);
                return error;
            },
        }),
        getLastRaceResults: builder.query({
            query: (raceId: number) => {
                console.log(
                    'Fetching last race results for raceId:',
                    `raceResults?$orderby=position_display_order&$filter=race_id eq ${parseInt(raceId.toString(), 10)}`,
                );
                return `raceResults?$orderby=position_display_order&$filter=race_id eq ${parseInt(
                    raceId.toString(),
                    10,
                )}`;
            },

            transformResponse: (response: { value: RaceNextProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching last race results:', error);
            },
        }),
        getLastResultsAtCircuit: builder.query({
            query: ({ circuitId }: { circuitId: string }) => {
                console.log('???????????????????????????? Fetching last results at circuit:', circuitId);
                return circuitId
                    ? `/lastResultsByCircuit?$filter=circuit_id eq '${circuitId}'&$orderby=position_number`
                    : `/lastResultsByCircuit?$filter=circuit_id eq '${circuitId}'`;
            },
            transformResponse: (response: { value: RaceProps[] }) => {
                console.log('-- Last results at circuit:', response);
                return response?.value ?? [];
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching last results at circuit:', error);
                return error;
            },
        }),
        getMaxRaceIdByCircuit: builder.query({
            query: (circuitId: string) => {
                console.log('Fetching max race ID by circuit:', circuitId);
                return `/maxRaceIdByCircuit?$filter=circuit_id eq '${circuitId}'`;
            },
            transformResponse: (response: { value: RaceProps[] }) => {
                console.log('Max race ID by circuit response:', response?.value[0]);
                return response?.value[0].max_race_id ?? '';
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching max race ID by circuit:', error);
                return error;
            },
        }),
        getNextRace: builder.query({
            query: () => 'raceNext',
            transformResponse: (response: { value: RaceNextProps }) => response?.value?.[0] ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching next race results:', error);
                return error;
            },
        }),
        getPreviousFirstPlaceResults: builder.query({
            query: (circuitId: string) => {
                console.log(
                    circuitId
                        ? `/previousFirstPlaceResults?$filter=circuit_id eq '${circuitId}'`
                        : `/previousFirstPlaceResults`,
                );
                return circuitId
                    ? `/previousFirstPlaceResults?$filter=circuit_id eq '${circuitId}'`
                    : `/previousFirstPlaceResults`;
            },

            transformResponse: (response: { value: RaceProps[] }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching previous first place results:', error);
                return error;
            },
        }),
        getPreviousRaceResults: builder.query({
            query: (circuitId: string) => {
                console.log(
                    'WTF',
                    circuitId
                        ? `/previousRaceResults?$filter=circuit_id eq '${circuitId}'&$orderby=year desc`
                        : `/previousRaceResults`,
                );
                return circuitId
                    ? `/previousRaceResults?$filter=circuit_id eq '${circuitId}'&$orderby=year desc`
                    : `/previousRaceResults`;
            },
            transformResponse: (response: { value: RaceProps[] }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching previous race results:', error);
                return error;
            },
        }),
        getRaceWithGP: builder.query({
            query: (raceId: number) => `raceGP?$filter=id eq ${raceId}`,
            transformResponse: (response: { value: RaceNextProps }) => response?.value[0] ?? [],
            transformErrorResponse: (error) => {
                console.error('Error fetching race with GP:', error);
            },
        }),
        getRaceCount: builder.query({
            query: () => `/raceCount`,
            transformResponse: (response: { value: RaceProps[] }) => response?.value[0].totalRaceCount ?? 0,
            transformErrorResponse: (error) => {
                console.error('Error ', error);
                return error;
            },
        }),
        getRaceCountByCircuit: builder.query({
            query: (circuitId: string) => `/raceCountByCircuit?$filter=circuit_id eq '${circuitId}'`,
            transformResponse: (response: { value: RaceProps[] }) => response?.value[0].totalRaceCount ?? 0,
            transformErrorResponse: (error) => {
                console.error('Error ', error);
                return error;
            },
        }),
        getRaces: builder.query({
            query: (year: number | undefined) =>
                year ? `/races?$filter=year eq ${year}&$orderby=date%20desc` : `/races?$orderby=date%20desc&$first=500`,
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
        /** @deprecated */
        // getDriverOfTheDay: builder.query({
        //     queryFn: async () => {
        //         try {
        //             const data = await dbFetch(`/driver-of-day`);
        //             console.log('we should NEVER SEE THIS data', data);
        //             return { data: data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        /** @deprecated */
        // getFastestPitStop: builder.query({
        //     queryFn: async (raceId: number | string = '') => {
        //         try {
        //             const data = await dbFetch(`/fastestPitStop?raceId=${raceId}`);
        //             return { data: data };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        getPreviousWinnersAtCircuit: builder.query({
            query: (circuitId: string) =>
                circuitId ? `/previousWinnersAtCircuit?$filter=circuitId eq ${circuitId}` : `/previousWinnersAtCircuit`,
            transformResponse: (response: { value: RaceProps }) => {
                console.log('-- Last results at circuit:', response);
                return response?.value ?? [];
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching last results at circuit:', error);
                return error;
            },
        }),

        /** @deprecated */
        // getRaceMaxYear: builder.query({
        //     queryFn: async () => {
        //         try {
        //             const results = await dbFetch('/raceMaxYear');
        //             return { data: results ?? [] };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
        getPointsByRace: builder.query({
            query: (year: number = 2024) => `/pointsByRace?year=${year}`,
        }),

        getPollPosition: builder.query({
            query: (raceId: number | string = '') =>
                `/previousRaceResults?$filter=id eq ${raceId} and position_number eq 1`,
            transformResponse: (response: { value: RaceProps }) => response?.value ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching poll position:', error);
                return error;
            },
        }),

        getRaceNext: builder.query({
            query: () => `/raceNext`,
            transformResponse: (response: { value: RaceNextProps }) => response?.value[0] ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching next race:', error);
                return error;
            },
        }),

        useGetRaceWinnerQuery: builder.query({
            query: (raceId: number | string = '') => `/raceWinner?$filter=id eq ${raceId}`,
            transformResponse: (response: { value: RaceProps }) => response?.value ?? {},
            transformErrorResponse: (error) => {
                console.error('Error fetching race winner:', error);
                return error;
            },
        }),

        /** @deprecated */
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
        getRacesResultsWithQual: builder.query({
            query: (id: number) => {
                console.log('getRacesResultsWithQual id:', id);
                return `/races?$filter=id eq ${id}`;
            },
            transformResponse: (response: { value: RaceProps[] }) => {
                console.log('Fetched races results with qualifying:', response);
                return response?.value ?? [];
            },
            transformErrorResponse: (error) => {
                console.error('Error fetching races results with qualifying:', error);
                return error;
            },
        }),
        getRaceResultsWithQual: builder.query({
            query: (year: number = YEAR) => `/race_result?$filter=year eq ${year}`,
            transformResponse: (response: { value: RaceNextProps }) => response?.value ?? [],
            transformErrorResponse: (error) => {
                console.error('Error', error);
                return error;
            },
        }),
        /** @deprecated */
        // getTotalWins: builder.query({
        //     queryFn: async (year: number = YEAR) => {
        //         try {
        //             const results = await dbFetch(`/totalWinsSeason?year=${year}`);
        //             return { data: results };
        //         } catch (error) {
        //             return buildErrorObject(error);
        //         }
        //     },
        // }),
    }),
});

export const {
    // useGetDriverOfTheDayQuery, -- @deprecated
    // useGetFastestPitStopQuery,
    // useGetRaceMaxYearQuery,
    // useGetRaceResultsPreviousQuery,
    // useGetTotalWinsQuery,
    useGetFastestLapQuery,
    useGetLastRaceResultsQuery,
    useGetLastResultsAtCircuitQuery,
    useGetMaxRaceIdByCircuitQuery,
    useGetNextPageQuery,
    useGetNextRaceQuery,
    useGetPointsByRaceQuery,
    useGetPollPositionQuery,
    useGetPreviousFirstPlaceResultsQuery,
    useGetPreviousRaceResultsQuery,
    useGetPreviousWinnersAtCircuitQuery,
    useGetRaceCountByCircuitQuery,
    useGetRaceCountQuery,
    useGetRaceNextQuery,
    useGetRaceQuery,
    useGetRaceResultsWithQualQuery,
    useGetRaceWinnerQuery,
    useGetRaceWithGPQuery,
    useGetRacesQuery,
    useGetRacesResultsWithQualQuery,
} = raceApi;
