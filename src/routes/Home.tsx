'use client';
import { RootState, useAppSelector } from 'app/store';

import CardContainer from '@/components/CardContainer';

import LastRaceResultsPod from '@/components/LastRaceResultsPod';
import NextReactBanner from '@/components/NextRaceBanner';

import { cn } from '@/lib/utils';
import { RaceProps } from '@/types/races';
import ErrorDialog from '@/components/ErrorDialog';
import DriverStandingsChart from '@/components/DriverStandingsChart';
import { CardFooter } from '@/components/ui/card';
import ConstructorStandings from '@/components/ConstructorsStandings';
import DriverOfTheDay from '@/components/DriverOfTheDay';
import TotalWinsPerYear from '@/components/TotalWinsPerYear';

import { POD_BG, POD_WIDTHS } from '@/constants/constants';

const Home: React.FC = () => {
    let raceWGP: Partial<RaceProps> | null = null;
    try {
        raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    } catch (error) {
        console.error('?????? Error fetching raceWGP:', error);
    }
    const systemError = useAppSelector((state) => state.siteWide.error);

    return (
        <>
            <NextReactBanner />
            {systemError && <ErrorDialog />}

            <div className="flex flex-col justify-center items-center mr-2">
                <div
                    className="
                lg:grid
                lg:gzrid-cols-3
                lg:grid-rows-3

                gap-4
                flex
                flex-col
                w-full"
                >
                    <div className={cn('col-start-1 row-start-1', POD_WIDTHS)}>
                        <CardContainer
                            className={cn('overflow-hidden', POD_BG, POD_WIDTHS)}
                            title={`Last Race: ${raceWGP ? raceWGP.official_name : 'N/A'}`}
                        >
                            <LastRaceResultsPod />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-1 row-start-2', POD_WIDTHS)}>
                        <CardContainer
                            className={cn('overflow-hidden', POD_BG, POD_WIDTHS)}
                            title="Constructors Standings"
                        >
                            <ConstructorStandings />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-1 md:col-start-2 row-start-3 md:row-start-2 ', POD_WIDTHS)}>
                        <CardContainer className={cn('overflow-hidden', POD_BG, POD_WIDTHS)} title="Total Wins">
                            <TotalWinsPerYear />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-2 row-start-1 col-span-2', POD_WIDTHS)}>
                        <CardContainer
                            className={cn('overflow-hidden', POD_BG, POD_WIDTHS)}
                            title={`Driver Standings`}
                            childrenClassName="flex flex-col items-end h-full justify-end w-full"
                        >
                            <DriverStandingsChart />
                            <CardFooter className="flex justify-between items-center w-full">
                                <div className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 cursor-pointer">
                                    <button rel="link">View Full Standings</button>
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    As of: {raceWGP ? raceWGP.official_name : 'N/A'}
                                </div>
                            </CardFooter>

                            {/* 
                            TODO: MAKE THIS A POPOVER on the GRAPH ON CLICK */}
                            {/* <div className={cn('col-start-2 row-start-2', POD_WIDTHS, 'bg-blue-400')}>
                                <CardContainer
                                    className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', POD_WIDTHS)}
                                    childrenClassName="w-full m-0 p-0"
                                    title="Driver Standings"
                                >
                                    <DriverStandings />
                                </CardContainer>
                            </div> */}
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-3 row-start-2', POD_WIDTHS)}>
                        <CardContainer className={cn('overflow-hidden', POD_BG, POD_WIDTHS)} title="Driver of the Day">
                            <DriverOfTheDay />
                        </CardContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
