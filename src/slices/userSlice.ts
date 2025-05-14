import { Vote } from '@/features/userApi';
import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number;
    name: string;
    email: string;
}

interface IState {
    user: User;
    vote: Vote;
}

const initialState: IState = {
    user: {} as User,
    vote: {} as Vote,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setVote: (state, action: PayloadAction<Vote>) => {
            state.vote = action.payload;
        },
        clearUser: (state) => {
            state.user = {} as User;
        },
        clearVote: (state) => {
            state.vote = {} as Vote;
        },
    },
});

export const { setUser, setVote, clearUser, clearVote } = userSlice.actions;

export default userSlice.reducer;
