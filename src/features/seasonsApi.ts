import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const seasonsApi = createApi({
    reducerPath: 'seasonsApi',
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getFastestLapsByYear: builder.query({
            query: (year) =>
                year
                    ? `/fastestLapsByYear?$filter=year eq ${year}&$orderby=fastest_laps desc&$first=3`
                    : `/fastestLaps&$orderby=fastest_laps desc&$first=3`,
            transformResponse: (response) => response?.value || [],
            transformErrorResponse: (error) => {
                console.error('Error fetching fastest laps:', error);
                return { error: 'Failed to fetch fastest laps' };
            },
        }),
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
        getTotalConstructorWinsBySeason: builder.query({
            query: (year) =>
                year
                    ? `/totalConstructorWinsBySeason?$filter=year eq ${year}&$orderby=wins desc&$first=3`
                    : `/totalConstructorWinsBySeason?$orderby=wins desc&$first=3`,
            transformResponse: (response) => response?.value || [],
            transformErrorResponse: (error) => {
                console.error('Error fetching total constructor wins by season:', error);
                return { error: 'Failed to fetch total constructor wins by season' };
            },
        }),
        getTotalDNFBySeason: builder.query({
            query: (year) =>
                year
                    ? `/totalDNFBySeason?$filter=year eq ${year}&$orderby=year desc&$orderby=totalDNF desc&$first=3`
                    : `/totalDNFBySeason?$orderby=year desc&$first=3`,
            transformResponse: (response) => response?.value || [],
            transformErrorResponse: (error) => {
                console.error('Error fetching total DNF by season:', error);
                return { error: 'Failed to fetch total DNF by season' };
            },
        }),
        getTotalWinsBySeason: builder.query({
            query: (year) =>
                year
                    ? `/totalWinsBySeason?$filter=year eq ${year}&$orderby=wins desc&$first=3`
                    : `/totalWinsBySeason?$orderby=wins desc&$first=3`,
            transformResponse: (response) => response?.value || [],
            transformErrorResponse: (error) => {
                console.error('Error fetching total wins by season:', error);
                return { error: 'Failed to fetch total wins by season' };
            },
        }),
    }),
});

export const {
    useGetFastestLapsByYearQuery,
    useGetSeasonStatsQuery,
    useGetTotalConstructorWinsBySeasonQuery,
    useGetTotalDNFBySeasonQuery,
    useGetTotalWinsBySeasonQuery,
} = seasonsApi;
