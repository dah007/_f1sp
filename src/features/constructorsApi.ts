import { REST_URL } from 'constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type ConstructorProps } from 'types/constructors';

export const constructorsApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    endpoints: (builder) => ({
        getConstructors: builder.query({
            query: () => `/constructors?$first=500`,
            transformResponse: (response: { value: ConstructorProps[] }) => {
                console.log(response);
                return response.value;
            },
        }),
        getConstructorById: builder.query({
            query: (id: string) => `/constructor?$filter=id eq ${id}`,
        }),
    }),
    reducerPath: 'constructorsApi',
});

export const { useGetConstructorsQuery, useGetConstructorByIdQuery } = constructorsApi;
