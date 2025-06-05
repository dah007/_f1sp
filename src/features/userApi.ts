import { User } from '@/slices/userSlice';
import { VoteValueProps } from '@/types/vote';
import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface CreateUserRequest {
    email: string;
    name: string;
    passcode: string;
}

export interface SubmitVoteRequest extends VoteValueProps {
    email?: string;
    passcode?: string;
    race_id: number;
    user_id?: number;
}

export const userApi = createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        checkVote: builder.query<VoteValueProps, { email: string; race_id: number }>({
            query: ({ email, race_id }) => {
                return `voteCheck?$filter=email eq '${email}' and race_id eq ${race_id}`;
            },
            transformResponse: (response: { value: VoteValueProps }) => {
                console.info('-=-=-==- Vote check response:', response);
                return response?.value ?? {};
            },
            transformErrorResponse: (response) => {
                console.error('Vote check error:', response);
                return response;
            },
        }),

        createUser: builder.mutation<User, CreateUserRequest>({
            query: (createUser) => ({
                url: 'createUser',
                method: 'POST',
                body: createUser,
            }),
            transformResponse: (response: User) => {
                console.log('????  User creation response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('!!!! User creation error:', response);
                return response;
            },
        }),

        getUser: builder.query<User, number | undefined>({
            query: (id: number | undefined) => `user/${id}`,
        }),

        submitVote: builder.mutation<VoteValueProps, SubmitVoteRequest>({
            query: (voteRequest) => {
                console.log(
                    '%cVote submission request:',
                    'color: blue; font-weight: bold; background:white; font-size:16px',
                    voteRequest,
                );
                return {
                    url: 'vote',
                    method: 'POST',
                    body: voteRequest,
                };
            },
            transformResponse: (response: VoteValueProps) => {
                console.log(
                    '%cVote submission response:',
                    'color: green; font-weight: bold; background:white; font-size:16px',
                    response,
                );
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

export const { useCheckVoteQuery, useGetUserQuery, useCreateUserMutation, useSubmitVoteMutation } = userApi;
