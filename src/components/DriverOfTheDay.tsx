import React, { useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { setDriversOfTheDay } from 'slices/driversSlice';
import { setError, setLoading } from 'slices/siteWideSlice';
import { setRaceNext } from 'slices/racesSlice';
import { useGetDriverOfTheDayQuery } from 'features/driversApi';
import { useGetRaceNextQuery } from 'features/raceApi';

import { FULL_ROW_HEIGHT, YEAR } from 'constants/constants';

import type { NextRaceProps } from 'types/races';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DriverOfTheDayProps } from '@/types/drivers';

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
    }, [dispatch, dataDriversOfTheDay, driverOfTheDayError, raceNextError]);

    return (
        <ScrollArea className={cn(FULL_ROW_HEIGHT, 'overflow-hidden border-t', 'mb-0', className)}>
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
