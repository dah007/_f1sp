import { VoteValueProps } from '@/types/vote';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface User {
    id?: number;
    name: string;
    email: string;
    passcode: string;
    voteCheck?: boolean;
}

interface IState {
    user: User;
    vote: VoteValueProps;
}

const initialState: IState = {
    user: { voteCheck: false } as User,
    vote: {} as VoteValueProps,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setVote: (state, action: PayloadAction<VoteValueProps>) => {
            state.vote = action.payload;
        },
        clearUser: (state) => {
            state.user = {} as User;
        },
        clearVote: (state) => {
            state.vote = {} as VoteValueProps;
        },

        setVoteCheck: (state, action: PayloadAction<boolean>) => {
            state.user.voteCheck = action.payload;
        },
    },
});

export const { setUser, setVote, clearUser, clearVote, setVoteCheck } = userSlice.actions;

export default userSlice.reducer;
