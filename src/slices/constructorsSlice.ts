import { createSlice } from '@reduxjs/toolkit';

import type { ConstructorProps, ManufacturerProps } from 'types/constructors';
import type { Engine } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IState {
    constructors: ConstructorProps[];
    engines: Engine[];
    enginesManufacturers: ManufacturerProps[];
    tyresManufacturers: ManufacturerProps[];
}

const initialState: IState = {
    constructors: [],
    engines: [],
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
        setEngines(state, action: PayloadAction<Engine[]>) {
            state.engines = action.payload;
        },
        setEnginesManufacturers(state, action: PayloadAction<ManufacturerProps[]>) {
            state.enginesManufacturers = action.payload;
        },
        setTyresManufacturers(state, action: PayloadAction<ManufacturerProps[]>) {
            state.tyresManufacturers = action.payload;
        },
    },
});

export const { setConstructors, setEngines, setEnginesManufacturers, setTyresManufacturers } = constructorSlice.actions;

export default constructorSlice.reducer;
