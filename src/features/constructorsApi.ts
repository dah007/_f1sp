import { REST_URL } from 'constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ManufacturerProps, type ConstructorProps } from 'types/constructors';

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

        getEnginesManufacturers: builder.query({
            query: (year) => (year ? `/engine_manufacturers?$filter=year eq ${year}` : `/engine_manufacturers`),
            transformResponse: (response: { value: ManufacturerProps[] }) => {
                // console.log(response);
                return response.value;
            },
        }),

        getTyresManufacturers: builder.query({
            query: (year) => (year ? `/tyres?$filter=year eq ${year}` : `/tyres`),
            transformResponse: (response: { value: ManufacturerProps[] }) => {
                console.log('TYRES!!!', response);
                return response.value;
            },
        }),
    }),
    reducerPath: 'constructorsApi',
});

export const {
    useGetConstructorsQuery,
    useGetConstructorByIdQuery,
    useGetEnginesManufacturersQuery,
    useGetTyresManufacturersQuery,
} = constructorsApi;
