import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

interface IState {
    currentRoute: SimpleRoute;
}

export type SimpleRoute = {
    label: string;
    path: string;
};

const defineCurrentRoute = (): SimpleRoute => {
    let tempRoute = {
        label: 'Home',
        path: '/',
    };
    if (localStorage.getItem('currentRoute')) {
        tempRoute = JSON.parse(JSON.stringify(localStorage.getItem('currentRoute')));
    }

    return tempRoute;
};

const initialState: IState = {
    currentRoute: defineCurrentRoute(),
};

export const routeSlice = createSlice({
    name: 'routeSlice',
    initialState,
    reducers: {
        setCurrentRoute: (state, action: PayloadAction<SimpleRoute>) => {
            let payload = action.payload;
            if (!payload) payload = initialState.currentRoute;

            state.currentRoute = payload;
        },
    },
});

export const { setCurrentRoute } = routeSlice.actions;

export default routeSlice.reducer;
