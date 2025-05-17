'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { RootState, useAppSelector } from '@/app/store';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { YEAR } from '@/constants/constants';
import { useGetDriverStandingsQuery } from '@/features/standingsApi';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { cn } from '@/lib/utils';
import { LocalDriverProps } from '@/routes/Standings';
import { selectDriverStandings } from '@/selectors/standingsSelector';
import { setDriverStandings } from '@/slices/standingsSlice';
import { DriverStanding } from '@/types/standings';
import { useEffect, useMemo } from 'react';

const DriverStandingsChart = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch();
    
    const chartData = useAppSelector((state: RootState) => selectDriverStandings(state)) satisfies LocalDriverProps[];

    const { data: driversData } = useGetDriverStandingsQuery(YEAR) as {
        data: DriverStanding[] | undefined;
    };

    const chartConfig: ChartConfig = useMemo(() => ({
        desktop: {
            label: 'Driver',
            color: 'hsl(var(--chart-1))',
        },
    }), []);

    useEffect(() => {
        if (!driversData) return;
        dispatch(setDriverStandings(driversData));
    }, [dispatch, driversData]);

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
                        style={{ fontWeight: 'bold' }}
                        angle={-90}
                        className="text-md"
                    /> */}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

export default DriverStandingsChart;
