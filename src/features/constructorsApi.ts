import { F1SP_BASE_DB_URL } from 'constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { dbFetch } from 'utils/index';

export const constructorsApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: F1SP_BASE_DB_URL }),
    endpoints: (builder) => ({
        getConstructors: builder.query({
            query: (year: number = 2024) => `/constructors?year=${year}`,
        }),
        getConstructorById: builder.query({
            query: (id: string) => `/constructor?id=${id}`,
        }),
    }),
    reducerPath: 'constructorsApi',
});

export const {
    useGetConstructorsQuery,
    useGetConstructorByIdQuery,
} = constructorsApi;
