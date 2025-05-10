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

const Home: React.FC = () => {
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    const systemError = useAppSelector((state) => state.siteWide.error);

    const widthsNHeights = 'h-[25vh] max-h-[25vh]';

    return (
        <>
            <NextReactBanner />
            {systemError && <ErrorDialog />}

            <div className="flex flex-col justify-center items-center mr-2">
                <div
                    className="
                lg:grid
                lg:grid-cols-3
                lg:grid-rows-3

                md:flex
                md:flex-col

                sm:flex
                sm:flex-col
                gap-4
                flex
                flex-col
                w-full"
                >
                    <div className={cn('col-start-1 row-start-1', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
                            title={`Last Race: ${raceWGP ? raceWGP.official_name : 'N/A'}`}
                        >
                            <LastRaceResultsPod />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-1 row-start-2', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
                            title="Constructors Standings"
                        >
                            <ConstructorStandings />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-2 row-start-2 ', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
                            title="Total Wins"
                        >
                            <TotalWinsPerYear />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-2 row-start-1 col-span-2', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
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
                            {/* <div className={cn('col-start-2 row-start-2', widthsNHeights, 'bg-blue-400')}>
                                <CardContainer
                                    className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
                                    childrenClassName="w-full m-0 p-0"
                                    title="Driver Standings"
                                >
                                    <DriverStandings />
                                </CardContainer>
                            </div> */}
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-3 row-start-2', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', widthsNHeights)}
                            title="Driver of the Day"
                        >
                            <DriverOfTheDay />
                        </CardContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
