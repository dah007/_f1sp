import CardContainer from '@/components/CardContainer';
import { cn } from '@/lib/utils';
import { ConstructorStanding, DriverStanding } from '@/types/standings';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import ConstructorsStanding from 'components/ConstructorsStandings';
import DriverStandings from 'components/DriverStandings';
import PageContainer from 'components/PageContainer';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';
import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import React, { JSX, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { driversConfig, selectConstructorStandings, selectDriverStandings } from 'selectors/standingsSelector';
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
}

function ConstructorChart({ data }: { data: ConstructorStanding[]; className?: string }): JSX.Element {
    const chartConfig = {
        points: {
            label: 'Points',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="mb-16 h-[28vh] w-[100%] overflow-hidden">
            <BarChart accessibilityLayer data={data} layout="vertical">
                <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                />
                <CartesianGrid vertical={false} />

                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
                            labelKey="full_name"
                            nameKey="full_name"
                        />
                    }
                    cursor={true}
                    wrapperStyle={{ outline: 'none' }}
                />

                <XAxis dataKey="points" type="number" hide />

                <Bar dataKey="points" radius={4} layout="vertical">
                    <LabelList
                        fill={`white`}
                        className="font-bold"
                        dataKey="short_name"
                        position="insideLeft"
                        offset={8}
                        fontSize={12}
                        // fill="fill-[--chart-1]"
                        formatter={(
                            value: string,
                            entry: {
                                payload: { fill?: string; name?: string; short_name?: string };
                                fill?: string;
                            },
                        ): string => {
                            console.log('entry', entry);

                            // Use the entry's fill to determine contrast
                            const fill = entry?.payload?.fill || entry?.fill;

                            // Convert fill color to luminance and return contrasting color
                            // This assumes fill is a valid hex color
                            if (!fill) return value;

                            // Simple contrast calculation - for more accuracy you could use a color utility
                            const hex = fill.replace('#', '');
                            const r = parseInt(hex.substr(0, 2), 16);
                            const g = parseInt(hex.substr(2, 2), 16);
                            const b = parseInt(hex.substr(4, 2), 16);
                            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

                            return brightness > 128 ? '#000000' : '#ffffff';
                        }}
                    />
                </Bar>
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
        console.log('constructorsData', constructorsData);
    }, [dispatch, constructorsData]);

    useEffect(() => {
        if (!driversData) return;
        dispatch(setDriverStandings(driversData));
    }, [dispatch, constructorsData, driversData]);

    // const localHeight = 'xl:h-[30vh] lg:h-[28vh] md:h-[25vh] h-[23vh]';
    console.log('colorConstructors', colorConstructors);

    return (
        <PageContainer
            title={`Standings ${selectedYear}`}
            showTitle={true}
            showBreadcrumbs={true}
            lastCrumb="Standings"
        >
            {/* 
                CONSTRUCTORS
            */}
            <div className={cn('flex flex-col lg:flex-row gap-4 m-0 mb-4 p-0')}>
                <CardContainer
                    className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 w-[58vw] h-[35vh]')}
                    title="Constructors Standings"
                >
                    <ConstructorChart data={colorConstructors} className="mb-4 h-[35vh] overflow-hidden" />
                </CardContainer>

                <CardContainer
                    className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 h-[35vh] w-[33vw]')}
                    title="Constructors Standings"
                >
                    <ConstructorsStanding year={selectedYear} />
                </CardContainer>
            </div>
            {/*     
                DRIVERS
            */}
            <div className={cn('grid grid-cols-2 grid-rows-1 gap-4 m-0 p-0')}>
                <CardContainer className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300')} title="Drivers Standings">
                    <DriverStandings year={selectedYear} />
                </CardContainer>

                {/* <Card className={cn(FULL_ROW_HEIGHT, 'overflow-hidden', 'dark:bg-zinc-800 bg-zinc-300')}>
                    <CardTitle className="pl-4 pt-0 m-0">Driver Standings</CardTitle>
                    <DriverStandings className={FULL_ROW_HEIGHT} year={selectedYear} />
                </Card> */}

                <CardContainer className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300')} title="Drivers">
                    <DriverChart data={colorDrivers} className="max-h-[100vh]" />
                </CardContainer>

                {/* <Card className={cn(FULL_ROW_HEIGHT, 'overflow-hidden w-full', 'dark:bg-zinc-800 bg-zinc-300')}>
                    <CardTitle className="pl-4 pt-0 m-0">Driver Chart</CardTitle>
                    <DriverChart data={colorDrivers} className="max-h-[100vh]" />
                </Card> */}

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
