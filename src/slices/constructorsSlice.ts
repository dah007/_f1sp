import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { ConstructorProps, ManufacturerProps } from 'types/constructors';

interface IState {
    constructors: ConstructorProps[];
    enginesManufacturers: ManufacturerProps[];
    tyresManufacturers: ManufacturerProps[];
}

const initialState: IState = {
    constructors: [],
    enginesManufacturers: [],
    tyresManufacturers: [],
};

export const constructorSlice = createSlice({
    name: 'constructorSlice',
    initialState: initialState,
    reducers: {
        setConstructors(state, action: PayloadAction<ConstructorProps[]>) {
            state.constructors = action.payload;
        },
        setEnginesManufacturers(state, action: PayloadAction<ManufacturerProps[]>) {
            state.enginesManufacturers = action.payload;
        },
        setTyresManufacturers(state, action: PayloadAction<ManufacturerProps[]>) {
            state.tyresManufacturers = action.payload;
        },
    },
});

export const { setConstructors, setEnginesManufacturers, setTyresManufacturers } = constructorSlice.actions;

export default constructorSlice.reducer;
