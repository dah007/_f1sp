import { User } from '@/slices/userSlice';
import { VoteValueProps } from '@/types/vote';
import { baseQueryWithRetry } from '@/utils/query';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface CreateUserRequest {
    name: string;
    email: string;
    passcode: string;
}

export interface SubmitVoteRequest extends VoteValueProps {
    user_id: number;
    race_id: number;
    email?: string;
    passcode?: string;
}

export const userApi = createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: (builder) => ({
        checkVote: builder.query<VoteValueProps, { user_id: number; race_id: number }>({
            query: ({ user_id, race_id }) => `voteCheck?$filter=user_id eq ${user_id} and race_id eq ${race_id}`,
            transformResponse: (response: { value: VoteValueProps }) => {
                console.log('-=-=-==- Vote check response:', response);
                return response?.value ?? {};
            },
            transformErrorResponse: (response) => {
                console.error('Vote check error:', response);
                return response;
            }
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
            }
        }),

        getUser: builder.query<User, number | undefined>({
            query: (id: number | undefined) => `user/${id}`,
        }),
        
        submitVote: builder.mutation<VoteValueProps, SubmitVoteRequest>({
            query: (voteRequest) => ({
                url: 'vote',
                method: 'POST',
                body: voteRequest,
            }),
            transformResponse: (response: VoteValueProps) => {
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

export const { 
    useCheckVoteQuery,    
    useGetUserQuery, 
    useCreateUserMutation, 
    useSubmitVoteMutation 
} = userApi;
