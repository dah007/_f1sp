import { User } from '@/slices/userSlice';
import { Driver } from '@/types/drivers';
import { VoteValueProps } from '@/types/vote';
import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface CreateUserRequest {
    name: string;
    email: string;
    passcode: string;
}

export interface SubmitVoteRequest {
    userId: number;
    raceId: number;
    voteData: VoteValueProps;
    email?: string;
    passcode?: string;
}

export interface Vote {
    blueTires: boolean;
    driversInCrash: { [key: string]: string };
    fastestLap: string;
    finishOrder: Driver[];
    firstLapCrash: boolean;
    greenTires: boolean;
    rain: boolean;
    reds: number;
    yellows: number;
}

export const userApi = createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        getUser: builder.query<User, number | undefined>({
            query: (id: number | undefined) => `user/${id}`,
        }),

        createUser: builder.mutation<User, CreateUserRequest>({
            query: (createUser) => ({
                url: 'user_add',
                method: 'POST',
                body: createUser,
            }),
            transformResponse: (response: User) => {
                console.log('User creation response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('User creation error:', response);
                return response;
            }
        }),

        createVote: builder.mutation<User, CreateUserRequest>({
            query: (userData) => ({
                url: 'users',
                method: 'POST',
                body: userData,
            }),
        }),

        submitVote: builder.mutation<Vote, SubmitVoteRequest>({
            query: (voteRequest) => ({
                url: 'createVote',
                method: 'POST',
                body: voteRequest,
            }),
            transformResponse: (response: Vote) => {
                console.log('Vote submission response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('Vote submission error:', response);
                return response;
            },
        }),
    }),
    reducerPath: 'userApi',
});

export const { useGetUserQuery, useCreateUserMutation, useCreateVoteMutation, useSubmitVoteMutation } = userApi;
