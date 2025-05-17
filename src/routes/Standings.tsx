import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import React, { JSX, useEffect } from 'react';

import DriverStandings from 'components/DriverStandings';
import PageContainer from 'components/PageContainer';
import { Card, CardContent, CardTitle } from 'components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';

import ConstructorsStanding from 'components/ConstructorsStandings';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { FULL_ROW_HEIGHT } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { ConstructorStanding, DriverStanding } from '@/types/standings';
import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import {
    constructorsConfig,
    driversConfig,
    selectConstructorStandings,
    selectDriverStandings,
} from 'selectors/standingsSelector';
import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';

export function DriverChart({ data, className }: { data: DriverStanding[]; className?: string }): JSX.Element {
    const driversChartConfig = driversConfig() satisfies ChartConfig;
    return (
        <>
            <ChartContainer config={driversChartConfig} className={className}>
                <BarChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="points" radius={8} />
                </BarChart>
            </ChartContainer>
        </>
    );
    // <ChartContainer config={driversChartConfig}>
    //     <BarChart accessibilityLayer data={data} className="h-[50] w-full">
    //         <CartesianGrid vertical={false} />
    //         <XAxis
    //             dataKey="month"
    //             tickLine={false}
    //             tickMargin={10}
    //             axisLine={false}
    //             tickFormatter={(value) => value.slice(0, 3)}
    //         />
    //         <Bar dataKey="points" fill="var(--color-desktop)" radius={4} height={1100} />
    //         <ChartTooltip
    //             cursor={false}
    //             content={<ChartTooltipContent hideLabel />}
    //             label={'Driver Name'}
    //             formatter={(value, name) => [value, name]}
    //             labelFormatter={(value) => value}
    //             labelClassName="text-sm font-medium text-gray-700"
    //         />
    //     </BarChart>
    // </ChartContainer>
}

function ConstructorChart({ data, className }: { data: ConstructorStanding[]; className?: string }): JSX.Element {
    const constructorsChartConfig = constructorsConfig() satisfies ChartConfig;

    return (
        <ChartContainer
            config={constructorsChartConfig}
            className={cn('absolute top-0 left-0 right-0 bottom-0', className)}
        >
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                {/* <ChartTooltip label={`hello`} cursor={false} content={<HoverTip />} /> */}
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="points" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}

export interface LocalConstructorProps {
    cName: string;
    constructor_id: string;
    emName: string;
    fill: string;
    points: number;
    position_number: number;
    year: number;
}

export interface LocalDriverProps {
    driver_id: string;
    name: string;
    fill: string;
    points: number;
    position_number: number;
    year: number;
}

/**
 * The `Standings` component is a React functional component that displays the standings
 * for constructors and drivers in a Formula 1 season. It fetches the standings data
 * from the Redux store and displays it in charts and tables.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Standings />
 *
 * @remarks
 * This component uses the `useAppDispatch` and `useAppSelector` hooks to interact with
 * the Redux store. It also uses the `useGetConstructorStandingsQuery` and `useGetDriverStandingsQuery`
 * hooks to fetch the standings data from an API.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Standings: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

    const colorConstructors = useAppSelector((state: RootState) =>
        selectConstructorStandings(state),
    ) satisfies LocalConstructorProps[];

    const colorDrivers = useAppSelector((state: RootState) =>
        selectDriverStandings(state),
    ) satisfies LocalDriverProps[];

    const { data: constructorsData } = useGetConstructorStandingsQuery(selectedYear) as {
        data: ConstructorStanding[] | undefined;
    };
    const { data: driversData } = useGetDriverStandingsQuery(selectedYear) as {
        data: DriverStanding[] | undefined;
    };

    useEffect(() => {
        if (!constructorsData) return;
        dispatch(setConstructorStandings(constructorsData));
    }, [dispatch, constructorsData]);

    useEffect(() => {
        if (!driversData) return;
        dispatch(setDriverStandings(driversData));
    }, [dispatch, constructorsData, driversData]);

    return (
        <PageContainer
            title={`Standings ${selectedYear}`}
            showTitle={true}
            showBreadcrumbs={true}
            lastCrumb="Standings"
        >
            <p>This is a bit of a hawt mess, it will get better.</p>
            {/* 
                CONSTRUCTORS
            */}
            <div className={cn(FULL_ROW_HEIGHT, 'flex flex-col lg:flex-row gap-4 m-0 mb-4 p-0')}>
                <div className={cn(FULL_ROW_HEIGHT, 'overflow-hidden w-1/2', 'dark:bg-zinc-800 bg-zinc-300 w-full')}>
                    <AspectRatio ratio={16 / 9}>
                        <ConstructorChart data={colorConstructors} />
                    </AspectRatio>
                </div>

                <Card className={cn(FULL_ROW_HEIGHT, 'overflow-hidden', 'dark:bg-zinc-800 bg-zinc-300 w-full')}>
                    <CardTitle className="pl-4 pt-0 m-0">Constructors Standings</CardTitle>
                    <CardContent className="w-full m-0 p-0">
                        <ConstructorsStanding className={FULL_ROW_HEIGHT} year={selectedYear} />
                    </CardContent>
                </Card>
            </div>
            {/*     
                DRIVERS
            */}
            <div className={cn(FULL_ROW_HEIGHT, 'grid grid-cols-2 grid-rows-1 gap-4 m-0 p-0')}>
                <Card className={cn(FULL_ROW_HEIGHT, 'overflow-hidden', 'dark:bg-zinc-800 bg-zinc-300')}>
                    <CardTitle className="pl-4 pt-0 m-0">Driver Standings</CardTitle>
                    <DriverStandings className={FULL_ROW_HEIGHT} year={selectedYear} />
                </Card>

                <Card className={cn(FULL_ROW_HEIGHT, 'overflow-hidden w-full', 'dark:bg-zinc-800 bg-zinc-300')}>
                    <CardTitle className="pl-4 pt-0 m-0">Driver Chart</CardTitle>
                    <DriverChart data={colorDrivers} className="max-h-[100vh]" />
                </Card>

                {/* <Card
                    className={cn(FULL_ROW_HEIGHT, 'overflow-hidden relative', 'dark:bg-zinc-800 bg-zinc-300 w-full')}
                >
                    <CardContent className="w-full m-0 p-4 content-end">
                        <DriverChart data={colorDrivers} driversChartConfig={driversChartConfig} />
                    </CardContent>
                </Card> */}
            </div>
        </PageContainer>
    );
};

export default Standings;
