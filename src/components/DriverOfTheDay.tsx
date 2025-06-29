import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import React, { useEffect } from 'react';

import { setError, setLoading } from '@/slices/systemWideSlice';
import { useGetDriverOfTheDayQuery } from 'features/driversApi';
import { useGetRaceNextQuery } from 'features/raceApi';
import { setDriversOfTheDay } from 'slices/driversSlice';
import { setRaceNext } from 'slices/racesSlice';

import { FULL_ROW_HEIGHT, YEAR } from 'constants/constants';

import { cn } from '@/lib/utils';
import { DriverOfTheDayProps } from '@/types/drivers';
import type { NextRaceProps } from 'types/races';
import CardSkeleton from './CardSkeleton';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

/**
 * DriverOfTheDay component displays a table of drivers and their voting percentages for the "Driver of the Day" award.
 *
 * @component
 * @example
 * ```tsx
 * <DriverOfTheDay className="custom-class" />
 * ```
 *
 * The component:
 * 1. Fetches data about the next race and the Driver of the Day from the API
 * 2. Dispatches actions to update the Redux store with fetched data
 * 3. Displays loading skeleton while data is being fetched
 * 4. Renders a scrollable table showing drivers and their percentage votes
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class name for custom styling
 * @returns {JSX.Element} A table displaying Driver of the Day results or a loading skeleton
 */
const DriverOfTheDay: React.FC = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch();

    const driversOfTheDay = useAppSelector((state: RootState) => state.drivers?.driversOfTheDay || []);
    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);

    const { data: raceNextData, isLoading: raceNextLoading, isError: raceNextError } = useGetRaceNextQuery(YEAR);

    useEffect(() => {
        if (raceNextError) {
            dispatch(setError(true));
            return;
        }
        if (raceNextLoading) dispatch(setLoading(true));
        if (!raceNextData) return;
        dispatch(setRaceNext(raceNextData as unknown as NextRaceProps));
        dispatch(setError(false));
    }, [dispatch, raceNextData, raceNextError, raceNextLoading]);

    const {
        data: dataDriversOfTheDay,
        isError: driverOfTheDayError,
        isLoading: driverOfTheDayLoading,
    } = useGetDriverOfTheDayQuery(parseInt(raceNext?.id as unknown as string, 10) - 1 || 0) as {
        data: DriverOfTheDayProps[];
        isError: boolean;
        isLoading: boolean;
    };

    useEffect(() => {
        if (driverOfTheDayError) dispatch(setError(true));
        if (driverOfTheDayLoading) dispatch(setLoading(true));
        if (!dataDriversOfTheDay) return;
        dispatch(setDriversOfTheDay(dataDriversOfTheDay));
        dispatch(setLoading(false));
    }, [dispatch, dataDriversOfTheDay, driverOfTheDayError, raceNextError, driverOfTheDayLoading]);

    if (driverOfTheDayLoading || raceNextLoading || !dataDriversOfTheDay) return <CardSkeleton />;

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, className, 'overflow-hidden border-t', 'mb-40')}>
            <Table className="w-full mb-10">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-4 text-right">%</TableHead>
                        <TableHead>Driver</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {driversOfTheDay?.map((driver: DriverOfTheDayProps, index) => (
                        <TableRow key={`${index}-${driver.percentage}`} className="h-8">
                            <TableCell className="text-right">{driver.percentage}</TableCell>
                            <TableCell>{driver.name}</TableCell>
                        </TableRow>
                    ))}
                    {/* ? basically just a footer spacer */}
                    <TableRow>
                        <TableCell className="text-right" colSpan={2}>
                            &nbsp;
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default DriverOfTheDay;
