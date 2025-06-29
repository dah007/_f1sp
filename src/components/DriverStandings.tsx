import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import { useEffect } from 'react';

import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import { setError, setLoading } from '@/slices/systemWideSlice';
import { useGetDriverStandingsQuery } from 'features/standingsApi';
import { setDriverStandings } from 'slices/standingsSlice';

import { cn } from '@/lib/utils';
import { FULL_ROW_HEIGHT, YEAR } from 'constants/constants';
import { type DriverStanding } from 'types/standings';

/**
 * A component that displays the Formula 1 driver standings for a specified year.
 *
 * This component fetches driver standings data using the useGetDriverStandingsQuery hook
 * and displays it in a tabular format. If data is available, it's stored in Redux state
 * via the setDriverStandings action. If an error occurs during the data fetching,
 * it dispatches the setError action.
 *
 * @component
 * @param {object} props - The component props
 * @param {number} [props.year=YEAR] - The year for which to display driver standings, defaults to current year constant
 * @returns {JSX.Element} A table displaying driver positions, numbers, names, and points or a message if no data is available
 *
 * @example
 * // Display standings for current year
 * <DriverStandings />
 *
 * @example
 * // Display standings for a specific year
 * <DriverStandings year={2022} />
 */
const DriverStandings = ({ year = YEAR, className = '' }: { year?: number; className?: string }): JSX.Element => {
    const dispatch = useAppDispatch();
    const driverStandings = useAppSelector((state: RootState) => state.standings.drivers);

    const {
        data: driverStandingsData,
        isError: driverStandingsIsError,
        isLoading: driverStandingsIsLoading,
    } = useGetDriverStandingsQuery(year) as {
        data: DriverStanding[] | undefined;
        isLoading?: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (driverStandingsIsLoading) dispatch(setLoading(true));

        if (driverStandingsIsError) {
            dispatch(setError(true));
            return;
        }
        if (!driverStandingsData) return;
        dispatch(setDriverStandings(driverStandingsData));
    }, [driverStandingsData, driverStandingsIsError, driverStandingsIsLoading, dispatch]);

    if (!driverStandings) {
        return <div className="text-center italic">No driver standings available.</div>;
    }

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, 'overflow-hidden border-t', className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4 text-right">Pos</TableHead>
                        <TableHead className="w-4 text-right">No</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead className="w-4 text-right">Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {driverStandings?.map((driver: DriverStanding, index: number) => (
                        <TableRow key={`${driver.driver_id}-${index}`} className="h-8">
                            <TableCell className="text-right">{driver.position_number}</TableCell>
                            <TableCell className="text-right">{driver.permanent_number}</TableCell>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell className="text-right">{driver.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default DriverStandings;
