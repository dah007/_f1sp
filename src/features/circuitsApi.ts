import { buildErrorObject, dbFetch } from '@/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { F1SP_BASE_DB_URL } from '../constants/constants';

/**
 * API slice for fetching circuit data from the F1 database.
 *
 * @remarks
 * This API slice uses `createApi` from Redux Toolkit Query to define endpoints and base query configurations.
 *
 * @constant
 * @type {Api}
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
    baseQuery: fetchBaseQuery({ baseUrl: F1SP_BASE_DB_URL }),
    endpoints: (builder) => ({
        getCircuits: builder.query({
            queryFn: async () => {
                try {
                    const results = await dbFetch(`/circuits`);
                    return { data: results };
                } catch (error) {
                    return buildErrorObject(error);
                }
            },
        }),
    }),
});

export const { useGetCircuitsQuery } = circuitsApi;
