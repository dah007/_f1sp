'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { RootState, useAppSelector } from '@/app/store';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { YEAR } from '@/constants/constants';
import { useGetDriverStandingsQuery } from '@/features/standingsApi';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { cn } from '@/lib/utils';
import { LocalDriverProps } from '@/routes/StandingsRoute';
import { selectDriverStandings } from '@/selectors/standingsSelector';
import { setDriverStandings } from '@/slices/standingsSlice';
import { DriverStanding } from '@/types/standings';
import { useEffect, useMemo } from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Fetch driver standings data for a specified year and renders it as a horizontal
 * bar chart showing points accumulated by each driver. While data is loading, a skeleton
 * placeholder is displayed.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class name to apply to the chart container
 *
 * @returns {JSX.Element} A bar chart displaying driver standings, a loading skeleton,
 *                        or a message if no data is available
 *
 * @example
 * // Basic usage
 * <DriverStandingsChart className="my-custom-class" />
 */
const DriverStandingsChart = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch();

    const chartData = useAppSelector((state: RootState) => selectDriverStandings(state)) satisfies LocalDriverProps[];

    const { data: driversData, isLoading: driversDataIsLoading } = useGetDriverStandingsQuery(YEAR) as {
        data: DriverStanding[] | undefined;
        isLoading: boolean;
    };

    const chartConfig: ChartConfig = useMemo(
        () => ({
            desktop: {
                label: 'Driver',
                color: 'hsl(var(--chart-1))',
            },
        }),
        [],
    );

    useEffect(() => {
        if (!driversData) return;
        dispatch(setDriverStandings(driversData));
    }, [dispatch, driversData]);

    if (driversDataIsLoading || !driversData) return <Skeleton className="h-[16vh] w-full" />;
    if (!chartData) return <div className="text-center italic">No driver standings available.</div>;

    return (
        <ChartContainer config={chartConfig} className={cn('h-[16vh] w-full', className)}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} hide type="category" />
                {/* <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} /> */}
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
                            nameKey="name"
                            labelFormatter={(value) => value}
                        />
                    }
                    cursor={true}
                    wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="points" radius={4}>
                    {/* <LabelList
                        dataKey="name"
                        position="insideStart"
                        fill="black"
                        fontSize={12}
                        textAnchor="middle"
                        style={{ fontWeight: 'bold', fontSize: '0.5rem' }}
                        angle={-90}
                    /> */}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
};

export default DriverStandingsChart;
