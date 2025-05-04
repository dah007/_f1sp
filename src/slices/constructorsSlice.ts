import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { ConstructorProps } from 'types/constructors';

interface IState {
    constructors: ConstructorProps[];
}

const initialState: IState = {
    constructors: [],
};

export const constructorSlice = createSlice({
    name: 'constructorSlice',
    initialState: initialState,
    reducers: {
        setConstructors(state, action: PayloadAction<ConstructorProps[]>) {
            state.constructors = action.payload;
        },
    },
});

export const { setConstructors } = constructorSlice.actions;

export default constructorSlice.reducer;
