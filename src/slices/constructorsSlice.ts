import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { ConstructorProps, EngineManufacturerProps } from 'types/constructors';

interface IState {
    constructors: ConstructorProps[];
    enginesManufacturers: EngineManufacturerProps[];
}

const initialState: IState = {
    constructors: [],
    enginesManufacturers: [],
};

export const constructorSlice = createSlice({
    name: 'constructorSlice',
    initialState: initialState,
    reducers: {
        setConstructors(state, action: PayloadAction<ConstructorProps[]>) {
            state.constructors = action.payload;
        },
        setEnginesManufacturers(state, action: PayloadAction<EngineManufacturerProps[]>) {
            state.enginesManufacturers = action.payload;
        },
    },
});

export const { setConstructors } = constructorSlice.actions;

export default constructorSlice.reducer;
