import React, { JSX, useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import DriverStandings from 'components/DriverStandings';
import PageContainer from 'components/PageContainer';
import { Card, CardContent, CardFooter, CardTitle } from 'components/ui/card';

import CardContainer from '@/components/CardContainer';

import ConstructorsStanding from 'components/ConstructorsStandings';
import DriverStandingsChart from '@/components/DriverStandingsChart';

import { useGetConstructorStandingsQuery, useGetDriverStandingsQuery } from 'features/standingsApi';
import { setConstructorStandings, setDriverStandings } from 'slices/standingsSlice';
import { cn } from '@/lib/utils';

import type { ConstructorStanding, DriverStanding } from '@/types/standings';
import type { RaceProps } from '@/types/races';
import ConstructorsStandingsChart from '@/components/ConstructorsStandingsChart';
import { POD_BG, POD_WIDTHS } from '@/constants/constants';

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

    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);

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
            {/* 

                
                        CONSTRUCTORS
                */}
            <div className={cn('flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-4 m-0 p-0')}>
                <CardContainer
                    className={cn('overflow-hidden', POD_BG, POD_WIDTHS)}
                    title={`Driver Standings`}
                    childrenClassName="flex flex-col items-end h-full justify-end w-full"
                >
                    <ConstructorsStandingsChart />
                    <CardFooter className="flex justify-between items-center w-full">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            As of: {raceWGP ? raceWGP.official_name : 'N/A'}
                        </div>
                    </CardFooter>
                </CardContainer>

                <Card className={cn(POD_WIDTHS, 'overflow-hidden', POD_BG, 'w-full')}>
                    <CardTitle className="pl-4 pt-0 m-0">Constructors Standings</CardTitle>
                    <CardContent className="w-full m-0 p-0">
                        <ConstructorsStanding className={POD_WIDTHS} year={selectedYear} />
                    </CardContent>
                </Card>
                {/* </div> */}
                {/* 
                
                        DRIVERS
                */}
                {/* <div className={cn('grid grid-cols-2 grid-rows-1 gap-4 m-0 p-0')}> */}
                <Card className={cn(POD_WIDTHS, 'overflow-hidden', POD_BG)}>
                    <CardTitle className="pl-4 pt-0 m-0">Driver Standings</CardTitle>
                    <DriverStandings className={POD_WIDTHS} year={selectedYear} />
                </Card>

                <CardContainer
                    className={cn('overflow-hidden', POD_BG, POD_WIDTHS)}
                    title={`Driver Standings`}
                    childrenClassName="flex flex-col items-end h-full justify-end w-full"
                >
                    <DriverStandingsChart />
                    <CardFooter className="flex justify-between items-center w-full">
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            As of: {raceWGP ? raceWGP.official_name : 'N/A'}
                        </div>
                    </CardFooter>
                </CardContainer>
            </div>
        </PageContainer>
    );
};

export default Standings;
