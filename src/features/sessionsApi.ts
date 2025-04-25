import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { dbFetch } from 'utils/index';

const baseURL = 'https://api.openf1.org/v1';

export const sessionsApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        getSessions: builder.query({
            //
            //  TODO:
            //
            // @ts-expect-error figure out how to remove all of the ts-ignores
            queryFn: async (year?: string = '2024'): Promise => dbFetch(`/sessions?year=${year}`),
        }),
    }),
    reducerPath: 'sessionsApi',
});

export const { useGetSessionsQuery } = sessionsApi;
