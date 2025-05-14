'use client';
import { useEffect } from 'react';
import { RootState, useAppSelector } from '@/app/store';
import { cn } from '@/lib/utils';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { selectConstructorStandings } from '@/selectors/standingsSelector';

import { useGetDriverStandingsQuery } from '@/features/standingsApi';
import { YEAR } from '@/constants/constants';
import { DriverStanding } from '@/types/standings';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { setDriverStandings } from '@/slices/standingsSlice';

import type { LocalConstructorProps } from '@/routes/Standings';

// const colorConstructors = useAppSelector((state: RootState) =>
//         selectConstructorStandings(state),
//     ) satisfies LocalConstructorProps[];

const chartConfig = {
    desktop: {
        label: 'Constructor',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export function ConstructorsStandingsChart({ className }: { className?: string }) {
    const dispatch = useAppDispatch();
    const chartData = useAppSelector((state: RootState) =>
        selectConstructorStandings(state),
    ) satisfies LocalConstructorProps[];
    const { data: driversData } = useGetDriverStandingsQuery(YEAR) as {
        data: DriverStanding[] | undefined;
    };

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
                <Bar dataKey="points" radius={4}></Bar>
            </BarChart>
        </ChartContainer>
    );
}

export default ConstructorsStandingsChart;
