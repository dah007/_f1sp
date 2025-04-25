import React, { JSX, useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import CardContainer from 'components/CardContainer';
import DriverStandings from 'components/DriverStandings';
// import DropdownYears from 'components/YearsDropdown';
import PageContainer from 'components/PageContainer';
import { Bar, BarChart, YAxis } from 'recharts';
import { Card, CardContent } from 'components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from 'components/ui/chart';
// import { Input } from 'components/ui/input';

import {
    constructorsConfig,
    driversConfig,
    selectConstructorStandings,
    selectDriverStandings,
} from 'selectors/standingsSelector';
import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';
import ConstructorsStanding from 'components/ConstructorsStandings';
import { ConstructorStanding, DriverStanding } from '@/types/standings';

interface LocalConstructorProps {
    cName: string;
    constructor_id: string;
    emName: string;
    fill: string;
    points: number;
    position_number: number;
    year: number;
}

interface LocalDriverProps {
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

    // const constructorStandings = useAppSelector((state: RootState) => state.standings.constructors);
    // const driverStandings = useAppSelector((state: RootState) => state.standings.drivers);
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

    const constructorsChartConfig = constructorsConfig() satisfies ChartConfig;
    const driversChartConfig = driversConfig() satisfies ChartConfig;

    // const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const updatedDrivers = driverStandings.filter((driver) => driver.name.includes(e.target.value));
    //     dispatch(setDriverStandings(updatedDrivers));
    //     const updatedConstructors = constructorStandings.filter((constructor) =>
    //         constructor.cName.includes(e.target.value),
    //     );
    //     dispatch(setConstructorStandings(updatedConstructors));
    // };

    return (
        <PageContainer
            title={`Standings ${selectedYear}`}
            showTitle={true}
            showBreadcrumbs={true}
            lastCrumb="Standings"
        >
            <div className="grid grid-cols-2 grid-rows-2 gap-2 m-4">
                <div className="row-start-1 h-[28vh] w-full p-0 m-0">
                    <Card className="h-full w-full p-0 m-0">
                        <CardContent className="w-full m-0 p-0">
                            <ChartContainer config={constructorsChartConfig} className="h-full w-full">
                                <BarChart accessibilityLayer data={colorConstructors}>
                                    <Bar dataKey="points" fill="var(--color-desktop)" radius={4} />
                                    <YAxis domain={[0, 750]} dataKey="points" />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="row-start-1 h-[28vh] w-full">
                    <CardContainer>
                        <ConstructorsStanding year={selectedYear} />
                    </CardContainer>
                </div>

                <div className="row-start-2 h-[28vh] w-full">
                    <CardContainer>
                        <DriverStandings year={selectedYear} />
                    </CardContainer>
                </div>
                <div className="row-start-2 h-[28vh] w-full">
                    <Card className="h-full w-full p-0 m-0">
                        <CardContent className="w-full m-0 p-0">
                            <ChartContainer config={driversChartConfig} className="h-full w-full">
                                <BarChart accessibilityLayer data={colorDrivers}>
                                    <Bar dataKey="points" radius={4} />
                                    <YAxis domain={[0, 500]} dataKey="points" />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
        // </div>
    );
};

export default Standings;
