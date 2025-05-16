import { createApi } from '@reduxjs/toolkit/query/react';

import type { Engine } from '@/types';
import { baseQueryWithRetry } from '@/utils/query';
import type { ConstructorProps, ManufacturerProps } from 'types/constructors';

export const constructorsApi = createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getConstructors: builder.query({
            query: () => `/constructors?$first=500`,
            transformResponse: (response: { value: ConstructorProps[] }) => response.value ?? null,
        }),
        getConstructorById: builder.query({
            query: (id: string) => `/constructor?$filter=id eq ${id}`,
            transformResponse: (response: { value: ConstructorProps[] }) => response.value ?? null,
        }),

        getEngines: builder.query({
            query: () => `/engines?$first=500`,
            transformResponse: (response: { value: Engine[] }) => response.value ?? null,
        }),

        getEnginesManufacturers: builder.query({
            query: (year) => (year ? `/engine_manufacturers?$filter=year eq ${year}` : `/engine_manufacturers`),
            transformResponse: (response: { value: ManufacturerProps[] }) => response.value ?? null,
        }),

        getTyresManufacturers: builder.query({
            query: () => '/tyres',
            transformResponse: (response: { value: ManufacturerProps[] }) => response.value ?? null,
        }),
    }),
    reducerPath: 'constructorsApi',
});

export const {
    useGetConstructorsQuery,
    useGetConstructorByIdQuery,
    useGetEnginesQuery,
    useGetEnginesManufacturersQuery,
    useGetTyresManufacturersQuery,
} = constructorsApi;
