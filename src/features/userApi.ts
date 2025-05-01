import { REST_URL } from '@/constants/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: number;
    name: string;
    email: string;
    passcode?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    passcode: string;
}

export const userApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: REST_URL }),
    endpoints: (builder) => ({
        getUser: builder.query<User, number | undefined>({
            query: (id: number | undefined) => `user/${id}`,
        }),

        // Update to use proper endpoint path matching your Azure Data API config
        createUser: builder.mutation<User, CreateUserRequest>({
            query: (createUser) => ({
                url: 'createUser', // This should match your Data API Builder REST path
                method: 'POST',
                body: createUser,
            }),
        }),

        // useCreateUserMutation: builder.mutation<User, Partial<User>>({
        //     query: (newUser) => ({
        //         url: 'user',
        //         method: 'POST',
        //         body: newUser,
        //     }),
        // }),
    }),
    reducerPath: 'userApi',
});

export const { useGetUserQuery, useCreateUserMutation } = userApi;
