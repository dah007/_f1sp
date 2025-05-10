import { JSX, useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import CustomLink from './CustomLink';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import { setPreviousResultsAtCircuit } from 'slices/racesSlice';
import { useGetLastResultsAtCircuitQuery } from 'features/raceApi';

import { RaceProps } from 'types/races';
import { YEAR } from 'constants/constants';
import { setError } from 'slices/siteWideSlice';

/**
 * `LastRacesAtCircuit` is a React functional component that displays the last race results at a specific circuit.
 * It fetches the data using the `useGetLastResultsAtCircuitQuery` hook and dispatches actions to update the Redux store.
 *
 * @returns {JSX.Element} A JSX element containing a table with the last race results at the circuit.
 *
 * @component
 *
 * @example
 * ```tsx
 * <LastRacesAtCircuit />
 * ```
 *
 * @remarks
 * - The component uses `useAppDispatch` and `useAppSelector` hooks to interact with the Redux store.
 * - If there is an error in fetching the data, it dispatches an action to set the error state.
 * - The fetched data is dispatched to update the previous results at the circuit in the Redux store.
 * - The component renders a table with columns for Year, Driver, and Time.
 *
 * @requires
 * - `useAppDispatch` from `react-redux`
 * - `useAppSelector` from `react-redux`
 * - `useGetLastResultsAtCircuitQuery` from the API slice
 * - `setError` action from the Redux slice
 * - `setPreviousResultsAtCircuit` action from the Redux slice
 * - `CustomLink` component for driver links
 *
 * @param {Object} props - The props that are passed to the component.
 * @param {string} props.YEAR - The year to be used in the driver link path.
 *
 * @typedef {Object} RaceProps
 * @property {number} year - The year of the race.
 * @property {number} permanent_number - The permanent number of the driver.
 * @property {string} id - The ID of the driver.
 * @property {string} full_name - The full name of the driver.
 * @property {string} time - The race time.
 */
const LastRacesAtCircuit: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const previousResultsAtCircuit = useAppSelector((state: RootState) => state.races.previousResultsAtCircuit) as
        | RaceProps[]
        | null;

    const { data, isError } = useGetLastResultsAtCircuitQuery('');

    if (isError) {
        dispatch(setError(true));
    }

    useEffect(() => {
        if (!data) return;

        console.log('Last results at circuit:', data);
        dispatch(setPreviousResultsAtCircuit(data));
    }, [dispatch, data]);

    if (!previousResultsAtCircuit || previousResultsAtCircuit.length === 0) {
        return <div>No results available</div>;
    }
    return (
        <div className="overflow-hidden">
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Year</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previousResultsAtCircuit &&
                            previousResultsAtCircuit.map((result: RaceProps, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{result.year}</TableCell>
                                        <TableCell width="80%">
                                            {result.permanent_number} -{' '}
                                            <CustomLink
                                                route={{
                                                    parent: {
                                                        path: `/drivers`,
                                                        label: 'Drivers',
                                                    },
                                                    path: `/drivers/${YEAR}/driver/${result.id}`,
                                                    label: String(result.full_name),
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{result.time}</TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default LastRacesAtCircuit;
