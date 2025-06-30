import { ConstructorStanding, DriverStanding } from '@/types/standings';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import PageContainer from 'components/PageContainer';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';
import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import React, { JSX, useEffect } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { selectConstructorStandings, selectDriverStandings } from 'selectors/standingsSelector';
import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';

// for recharts v2.1 and above
import CardContainer from '@/components/CardContainer';
import ConstructorStandings from '@/components/ConstructorsStandingsTable';
import DriverStandings from '@/components/DriverStandings';
import { cn } from '@/lib/utils';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export function ConstructorChart({
    data,
    className,
}: {
    data: ConstructorStanding[];
    className?: string;
}): JSX.Element {
    const constructorsChartConfig = {
        points: {
            label: 'Points',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Logarithmic transform for points (add 1 to avoid log(0))
    const logData = data.map((item) => ({
        ...item,
        logPoints: Math.log10(item.points + 1),
    }));

    return (
        <ChartContainer config={constructorsChartConfig} className={cn('w-[85vw]', className)}>
            <BarChart accessibilityLayer data={logData} layout="vertical">
                <YAxis dataKey="short_name" type="category" hide width={0} />
                <XAxis type="number" hide />

                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
                            nameKey="name"
                            formatter={(_value: ValueType, _name: NameType, { payload }) => [
                                payload?.points,
                                ' Points',
                            ]}
                        />
                    }
                    cursor={true}
                    wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="logPoints" radius={4}>
                    <LabelList
                        fill="white"
                        className="font-bold"
                        dataKey="short_name"
                        position="insideLeft"
                        offset={0}
                        fontSize={12}
                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

export function DriverChart({ data, className }: { data: DriverStanding[]; className?: string }): JSX.Element {
    const driversChartConfig = {
        points: {
            label: 'Points',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Logarithmic transform for points (add 1 to avoid log(0))
    const logData = data.map((item) => ({
        ...item,
        logPoints: Math.log10(item.points + 1),
    }));

    return (
        <ChartContainer config={driversChartConfig} className={cn('w-[85vw]', className)}>
            <BarChart accessibilityLayer data={logData} layout="vertical" className="h-full">
                <YAxis dataKey="name" type="category" hide width={0} />
                <XAxis type="number" hide />

                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
                            nameKey="name"
                            formatter={(_value: ValueType, _name: NameType, { payload }) => [
                                payload?.points,
                                ' Points',
                            ]}
                        />
                    }
                    cursor={true}
                    wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="logPoints" radius={4}>
                    <LabelList
                        fill="white"
                        className="font-bold"
                        dataKey="name"
                        position="insideLeft"
                        offset={6}
                        fontSize={12}
                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

export interface ColorizedConstructorProps {
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

// function to remove duplicates from an array of objects based on a specific key
function removeDuplicates<T extends Record<string, number>>(array: T[], key: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        } else {
            seen.add(value);
            return true;
        }
    });
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

    const selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);

    const colorConstructors = useAppSelector((state: RootState) =>
        selectConstructorStandings(state),
    ) satisfies ColorizedConstructorProps[];

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

    return (
        <PageContainer
            title={`Standings ${selectedYear}`}
            showTitle={true}
            showBreadcrumbs={true}
            lastCrumb="Standings"
        >
            {/* <div className="flex flex-col md:flex-row gap-0 w-[99vw] h-[20vh]">
                <TeamPerformanceRadar data={removeDuplicates(colorConstructors, 'constructor_id')} />
            </div> */}

            <div className="flex flex-col md:flex-row gap-0 w-[99vw]">
                {/* LEFT SIDE */}
                <div className="p-4 w-[100%] md:w-[45%] h-[100vh] flex flex-col gap-4">
                    <CardContainer
                        className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 h-[100vh] md:h-[150vh] w-full')}
                        title="Drivers"
                    >
                        <DriverChart
                            data={removeDuplicates(colorDrivers, 'driver_id')}
                            className={cn('w-full h-[93.5vh] md:h-[85vh] mb-4 overflow-hidden')}
                        />
                    </CardContainer>
                </div>

                {/* RIGHT SIDE */}

                <div className="p-4 w-[100%] md:w-[45%] flex flex-col gap-4 h-[150vh]">
                    <CardContainer
                        className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 w-full h-[40vh] md:h-[24vh]')}
                        title="Drivers Standings"
                    >
                        <DriverStandings year={selectedYear} />
                    </CardContainer>
                    <CardContainer
                        className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 w-full pb-0 h-[120vh]')}
                        title="Constructors"
                    >
                        <ConstructorChart
                            data={colorConstructors}
                            className={cn('w-full h-[180%] mb-4 overflow-hidden')}
                        />
                    </CardContainer>
                    <CardContainer
                        className={cn(
                            'overflow-hidden dark:bg-zinc-800 bg-zinc-300 h-[60vh] md:h-[33vh] w-full mb:p-[60px]',
                        )}
                        title="Constructors Standings"
                    >
                        <ConstructorStandings year={selectedYear} />
                    </CardContainer>
                </div>
            </div>
        </PageContainer>
    );
};

export default Standings;
// import { cn } from '@/lib/utils';
// import { ConstructorStanding, DriverStanding } from '@/types/standings';
// import { RootState, useAppDispatch, useAppSelector } from 'app/store';
// import PageContainer from 'components/PageContainer';
// import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';
// import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
// import React, { JSX, useEffect } from 'react';
// import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
// import { selectConstructorStandings, selectDriverStandings } from 'selectors/standingsSelector';
// import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';

// // for recharts v2.1 and above
// import CardContainer from '@/components/CardContainer';
// import ConstructorStandings from '@/components/ConstructorsStandings';
// import DriverStandings from '@/components/DriverStandings';
// import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// export function ConstructorChart({
//     data,
//     className,
// }: {
//     data: ConstructorStanding[];
//     className?: string;
// }): JSX.Element {
//     const constructorsChartConfig = {
//         points: {
//             label: 'Points',
//             color: 'hsl(var(--chart-1))',
//         },
//     } satisfies ChartConfig;

//     // Logarithmic transform for points (add 1 to avoid log(0))
//     const logData = data.map((item) => ({
//         ...item,
//         logPoints: Math.log10(item.points + 1),
//     }));

//     return (
//         <ChartContainer config={constructorsChartConfig} className={cn('w-[85vw]', className)}>
//             <BarChart accessibilityLayer data={logData} layout="vertical">
//                 <YAxis dataKey="short_name" type="category" hide width={0} />
//                 <XAxis type="number" hide />

//                 <ChartTooltip
//                     content={
//                         <ChartTooltipContent
//                             className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
//                             nameKey="name"
//                             formatter={(_value: ValueType, _name: NameType, { payload }) => [
//                                 payload?.points,
//                                 ' Points',
//                             ]}
//                         />
//                     }
//                     cursor={true}
//                     wrapperStyle={{ outline: 'none' }}
//                 />
//                 <Bar dataKey="logPoints" radius={4}>
//                     <LabelList
//                         fill="white"
//                         className="font-bold"
//                         dataKey="short_name"
//                         position="insideLeft"
//                         offset={0}
//                         fontSize={12}
//                         style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
//                     />
//                 </Bar>
//             </BarChart>
//         </ChartContainer>
//     );
// }

// export function DriverChart({ data, className }: { data: DriverStanding[]; className?: string }): JSX.Element {
//     const driversChartConfig = {
//         points: {
//             label: 'Points',
//             color: 'hsl(var(--chart-1))',
//         },
//     } satisfies ChartConfig;

//     // Logarithmic transform for points (add 1 to avoid log(0))
//     const logData = data.map((item) => ({
//         ...item,
//         logPoints: Math.log10(item.points + 1),
//     }));

//     return (
//         <ChartContainer config={driversChartConfig} className={cn('w-[85vw]', className)}>
//             <BarChart accessibilityLayer data={logData} layout="vertical" className="h-full">
//                 <YAxis dataKey="name" type="category" hide width={0} />
//                 <XAxis type="number" hide />

//                 <ChartTooltip
//                     content={
//                         <ChartTooltipContent
//                             className="w-[150px] bg-zinc-800 dark:bg-zinc-600 text-lg"
//                             nameKey="name"
//                             formatter={(_value: ValueType, _name: NameType, { payload }) => [
//                                 payload?.points,
//                                 ' Points',
//                             ]}
//                         />
//                     }
//                     cursor={true}
//                     wrapperStyle={{ outline: 'none' }}
//                 />
//                 <Bar dataKey="logPoints" radius={4}>
//                     <LabelList
//                         fill="white"
//                         className="font-bold"
//                         dataKey="name"
//                         position="insideLeft"
//                         offset={6}
//                         fontSize={12}
//                         style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
//                     />
//                 </Bar>
//             </BarChart>
//         </ChartContainer>
//     );
// }

// export interface ColorizedConstructorProps {
//     cName: string;
//     constructor_id: string;
//     emName: string;
//     fill: string;
//     points: number;
//     position_number: number;
//     year: number;
// }

// export interface LocalDriverProps {
//     driver_id: string;
//     name: string;
//     fill: string;
//     points: number;
//     position_number: number;
//     year: number;
// }

// /**
//  * The `Standings` component is a React functional component that displays the standings
//  * for constructors and drivers in a Formula 1 season. It fetches the standings data
//  * from the Redux store and displays it in charts and tables.
//  *
//  * @component
//  * @returns {JSX.Element} The rendered component.
//  *
//  * @example
//  * <Standings />
//  *
//  * @remarks
//  * This component uses the `useAppDispatch` and `useAppSelector` hooks to interact with
//  * the Redux store. It also uses the `useGetConstructorStandingsQuery` and `useGetDriverStandingsQuery`
//  * hooks to fetch the standings data from an API.
//  *
//  * @returns {JSX.Element} The rendered component.
//  */
// const Standings: React.FC = (): JSX.Element => {
//     const dispatch = useAppDispatch();

//     const selectedYear = useAppSelector((state: RootState) => state.systemWide.selectedYear);

//     const colorConstructors = useAppSelector((state: RootState) =>
//         selectConstructorStandings(state),
//     ) satisfies ColorizedConstructorProps[];

//     const colorDrivers = useAppSelector((state: RootState) =>
//         selectDriverStandings(state),
//     ) satisfies LocalDriverProps[];

//     const { data: constructorsData } = useGetConstructorStandingsQuery(selectedYear) as {
//         data: ConstructorStanding[] | undefined;
//     };
//     const { data: driversData } = useGetDriverStandingsQuery(selectedYear) as {
//         data: DriverStanding[] | undefined;
//     };

//     useEffect(() => {
//         if (!constructorsData) return;
//         dispatch(setConstructorStandings(constructorsData));
//         console.log('constructorsData', constructorsData);
//     }, [dispatch, constructorsData]);

//     useEffect(() => {
//         if (!driversData) return;
//         dispatch(setDriverStandings(driversData));
//     }, [dispatch, constructorsData, driversData]);

//     return (
//         <PageContainer
//             title={`Standings ${selectedYear}`}
//             showTitle={true}
//             showBreadcrumbs={true}
//             lastCrumb="Standings"
//         >
//             <div className="flex flex-col md:flex-row gap-0 w-[99vw]">
//                 {/* LEFT SIDE */}

//                 <div className="p-4 w-[100%] md:w-[45%] h-[100vh] flex flex-col gap-4">
//                     <CardContainer
//                         className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 h-[100vh] md:h-[150vh] w-full')}
//                         title="Drivers"
//                     >
//                         <DriverChart
//                             data={colorDrivers}
//                             className={cn('w-full h-[93.5vh] md:h-[85vh] mb-4 overflow-hidden')}
//                         />
//                     </CardContainer>
//                 </div>

//                 {/* RIGHT SIDE */}

//                 <div className="p-4 w-[100%] md:w-[45%] flex flex-col gap-4 h-[150vh]">
//                     <CardContainer
//                         className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 w-full h-[40vh] md:h-[24vh]')}
//                         title="Drivers Standings"
//                     >
//                         <DriverStandings year={selectedYear} />
//                     </CardContainer>
//                     <CardContainer
//                         className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300 w-full pb-0 h-[120vh]')}
//                         title="Constructors"
//                     >
//                         <ConstructorChart
//                             data={colorConstructors}
//                             className={cn('w-full h-[180%] mb-4 overflow-hidden')}
//                         />
//                     </CardContainer>
//                     <CardContainer
//                         className={cn(
//                             'overflow-hidden dark:bg-zinc-800 bg-zinc-300 h-[60vh] md:h-[33vh] w-full mb:p-[60px]',
//                         )}
//                         title="Constructors Standings"
//                     >
//                         <ConstructorStandings year={selectedYear} />
//                     </CardContainer>
//                 </div>
//             </div>
//         </PageContainer>
//     );
// };

// export default Standings;
