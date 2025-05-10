import React, { useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import { setDriversOfTheDay } from 'slices/driversSlice';
import { setError } from 'slices/siteWideSlice';
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

    const { data: raceNextData, isError: raceNextError } = useGetRaceNextQuery(YEAR);

    useEffect(() => {
        if (!raceNextData) return;

        console.log('? raceNextData', raceNextData);
        dispatch(setRaceNext(raceNextData as unknown as NextRaceProps));
    }, [dispatch, raceNextData]);

    const { data: dataDriversOfTheDay, isError: driverOfTheDayError } = useGetDriverOfTheDayQuery(
        parseInt(raceNext?.id as unknown as string, 10) - 1 || 0,
    ) as {
        data: DriverOfTheDayProps[];
        isError: boolean;
    };

    useEffect(() => {
        if (driverOfTheDayError || raceNextError) {
            dispatch(setError(true));
        }
        if (!dataDriversOfTheDay) return;

        console.log('dataDriversOfTheDay', dataDriversOfTheDay);
        dispatch(setDriversOfTheDay(dataDriversOfTheDay));
    }, [dispatch, dataDriversOfTheDay, driverOfTheDayError, raceNextError]);

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
                    {driversOfTheDay?.map((driver: DriverOfTheDayProps) => (
                        <TableRow key={driver.id}>
                            <TableCell className="text-right">{driver.percentage}</TableCell>
                            <TableCell>{driver.full_name}</TableCell>
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
