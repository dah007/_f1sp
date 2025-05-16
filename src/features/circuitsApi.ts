import { CircuitProps } from '@/types/circuits';
import { buildErrorObject } from '@/utils';
import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

/**
 * API slice for fetching circuit data from the F1 database.
 *
 * @remarks
 * This API slice uses `createApi` from Redux Toolkit Query to define endpoints and base query configurations.
 *
 * @constant
 * @type {ReturnType<typeof createApi>}
 *
 * @property {string} reducerPath - The path to the reducer in the Redux store.
 * @property {function} baseQuery - The base query function for making HTTP requests.
 * @property {function} endpoints - A function that defines the endpoints for the API.
 *
 * @example
 * const { data, error } = useGetCircuitsQuery({ startYear: 2000, endYear: 2020 });
 *
 * @endpoint getCircuits
 * @param {object} params - The parameters for the query.
 * @param {number} params.startYear - The starting year for the circuits data.
 * @param {number} params.endYear - The ending year for the circuits data.
 * @returns {Promise<object>} The fetched circuits data.
 */
export const circuitsApi = createApi({
    reducerPath: 'circuitsApi',
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getCircuits: builder.query({
            query: ({ startYear, endYear }) => ({
                url: `/circuitWYear?$filter=(race_year gt ${startYear}) and (race_year le ${endYear})`,
                method: 'GET',
            }),
            transformResponse: (response: { value: CircuitProps[] }) => {
                if (response?.value) {
                    return response.value.map((circuit) => ({
                        ...circuit,
                        lat: circuit.latitude,
                        lng: circuit.longitude,
                        bbox: [circuit.longitude, circuit.latitude], // ? NOT a mistake, mbox is [lng, lat]
                    }));
                }
                return [];
            },
            transformErrorResponse: (error) => {
                const errorMessage = buildErrorObject(error);
                return {
                    error: {
                        status: error.status,
                        message: errorMessage,
                    },
                };
            },
        }),
    }),
});

export const { useGetCircuitsQuery } = circuitsApi;
