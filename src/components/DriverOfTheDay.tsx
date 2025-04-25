import React, { useEffect } from 'react';
import { RootState, useAppDispatch } from 'app/store';
import { useAppSelector } from '../hooks/reduxHooks';

import { type ChartConfig } from 'components/ui/chart';

import { setDriversOfTheDay } from 'slices/driversSlice';
import { setError } from 'slices/siteWideSlice';
import { setRaceNext } from 'slices/racesSlice';
import { useGetDriverOfDayQuery } from 'features/driversApi';
import { useGetRaceNextQuery } from 'features/raceApi';

import type { DriverOfTheDay } from 'types/drivers';
import type { NextRaceProps } from 'types/races';
import { YEAR } from 'constants/constants';
import Chart from './Chart';

const DriverOfTheDay: React.FC = () => {
    const dispatch = useAppDispatch();

    const driversOfTheDay = useAppSelector<DriverOfTheDay[]>(
        (state: RootState) => state.drivers?.driversOfTheDay || [],
    );
    const raceNext =
        useAppSelector<NextRaceProps | null>((state: RootState) => state.races?.raceNext) ||
        ({ id: '' } as NextRaceProps);
    const raceLastName = useAppSelector<string>((state: RootState) =>
        state?.races && state.races?.lastRaceResults?.length
            ? (state.races?.lastRaceResults[0]?.short_name ?? 'N/A')
            : 'N/A',
    );

    const { data: raceNextData, isError: raceNextError } = useGetRaceNextQuery(YEAR);

    useEffect(() => {
        if (!raceNextData) return;

        dispatch(setRaceNext(raceNextData as unknown as NextRaceProps));
    }, [dispatch, raceNextData]);

    const { data: dataDriversOfTheDay, isError: driverOfTheDayError } = useGetDriverOfDayQuery(raceNext?.id);

    if (driverOfTheDayError || raceNextError) {
        dispatch(setError(true));
    }

    useEffect(() => {
        if (!dataDriversOfTheDay) return;

        dispatch(setDriversOfTheDay(dataDriversOfTheDay));
    }, [dispatch, dataDriversOfTheDay]);

    type TChartConfig = {
        [key: string]: {
            label: string;
            color: string;
        };
    };

    const cConfig: TChartConfig = {};

    driversOfTheDay.forEach((driver) => {
        cConfig[driver.permanent_number] = {
            label: driver.full_name,
            color: 'hsl(var(--chart-1))',
        };
    });

    const maxPercentage = Math.max(...driversOfTheDay.map((driver) => driver.percentage));

    return (
        <Chart
            className="ml-4 mr-4 pb-1 w-[95%] h-[25vh]"
            config={cConfig as unknown as ChartConfig}
            data={driversOfTheDay as unknown as Record<string, number>[]}
            description="The most voted drivers of the day"
            layout="vertical"
            maxValue={maxPercentage}
            minValue={0}
            title={`Drivers of the day @ ${raceLastName}`}
            xAxis="percentage"
            yAxis="full_name"
        />
    );
};

export default DriverOfTheDay;
