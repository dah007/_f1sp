// import React, { useEffect } from 'react';
// import { RootState, useAppDispatch, useAppSelector } from 'app/store';

// import ConstructorStandings from '@/components/ConstructorsStandings';
import CardContainer from '@/components/CardContainer';
import DriverOfTheDay from '@/components/DriverOfTheDay';
import DriverStandings from '@/components/DriverStandings';
import ErrorDialog from '@/components/ErrorDialog';
import LastRaceResultsPod from '@/components/LastRaceResultsPod';
import NextReactBanner from '@/components/NextRaceBanner';
import { FULL_ROW_HEIGHT } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { RaceProps } from '@/types/races';
// import { Card, CardContent, CardTitle } from '@/components/ui/card';
// import { YEAR } from '@/constants/constants';
import { /*useAppDispatch, */ RootState, useAppSelector } from 'app/store';
// import CardContainer from 'components/CardContainer';
// import ErrorDialog from 'components/ErrorDialog';
// import LastRaceResultsPod from 'components/LastRaceResultsPod';

// import LastRacesAtCircuit from '/components/LastRacesAtCircuit';
// import { useGetLastRaceResultsQuery } from 'features/raceApi';
// import { setPreviousResultsAtCircuit } from 'slices/racesSlice';
// import { useEffect } from 'react';
// import { RaceProps } from 'types/races';
// import DriverOfTheDay from 'components/DriverOfTheDay';
// import DriverStandings from 'components/DriverStandings';
// import { YEAR } from 'constants/constants';
// import ErrorDialog from 'components/ErrorDialog';
// import DriverStandings from 'components/DriverStandings';
// import { YEAR } from 'constants/constants';
// import LastRaceResultsPod from 'components/LastRaceResultsPod';
// import NextReactBanner from 'components/NextRaceBanner';
// import DriverStandings from '/components/DriverStandings';
// import Standings from './Standings';
// import TotalWinsPod from 'components/TotalWinsPod';

// import CardContainer from 'components/CardContainer';
// import DriverOfTheDay from 'components/DriverOfTheDay';
// import DriverStandings from 'components/DriverStandings';
// import ErrorDialog from 'components/ErrorDialog';
// import LastRaceResultsPod from 'components/LastRaceResultsPod';
// import LastRacesAtCircuit from 'components/LastRacesAtCircuit';
// import NextReactBanner from 'components/NextRaceBanner';
// import NextYearSchedule from 'components/NextYearSchedule';
// import TotalWinsPod from 'components/TotalWinsPod';

// import { setError } from 'slices/siteWideSlice';
// import { setPreviousResultsAtCircuit } from 'slices/racesSlice';

// import { YEAR } from 'constants/constants';

// import type { RaceResultProps } from 'types/races';

// const lastSeason: number = YEAR - 1;
// const nextYear: number = YEAR + 1;

const Home: React.FC = () => {
    // const dispatch = useAppDispatch();
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    const systemError = useAppSelector((state) => state.siteWide.error);

    return (
        <>
            <NextReactBanner />

            {systemError && <ErrorDialog />}

            <div className="flex flex-col justify-center items-center mr-2">
                <div
                    className="
                lg:grid
                lg:grid-cols-2
                lg:grid-rows-2

                md:flex
                md:flex-col

                sm:flex
                sm:flex-col
                gap-4

                flex
                flex-col
                w-full"
                >
                    <div className="row-start-1 col-start-1 w-full">
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', FULL_ROW_HEIGHT)}
                            childrenClassName="w-full m-0 p-0"
                            title={`Last Race: ${raceWGP ? raceWGP.official_name : 'N/A'}`}
                        >
                            <LastRaceResultsPod />
                        </CardContainer>
                    </div>
                    <div className="row-start-2 col-start-1 w-full">
                        {/* <Card className={cn(rowHeight, 'overflow-hidden', 'dark:bg-zinc-800 bg-zinc-300')}>
                            <CardTitle className="pl-4 pt-0 m-0">Constructors Standings</CardTitle>
                            <CardContent className="w-full m-0 p-0">
                                <ConstructorsStanding className={rowHeight} year={YEAR} />
                            </CardContent>
                        </Card> */}
                    </div>
                    {/* <div className="col-start-2 row-start-2 w-full">
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', FULL_ROW_HEIGHT)}
                            childrenClassName="w-full m-0 p-0"
                            title={`Driver of the Day: ${`lastRace ? lastRace.name : 'N/A'`}`}
                        >
                            <DriverOfTheDay />
                        </CardContainer>
                    </div> */}
                    <div className="col-start-2 row-start-1">
                        <CardContainer
                            className={cn('overflow-hidden dark:bg-zinc-800 bg-zinc-300', FULL_ROW_HEIGHT)}
                            childrenClassName="w-full m-0 p-0"
                            title="Driver Standings"
                        >
                            <DriverStandings />
                        </CardContainer>
                    </div>
                    {/* <div className="col-start-3 row-start-2">
                        <CardContainer
                            className="overflow-hidden h-[20vh]"
                            bodyclassName={'w-full h-[20vh]'}
                            content={<LastRacesAtCircuit />}
                            title={`Previous Results at Circuit`}
                        />
                    </div>
                    <div className="col-span-2 col-start-3 row-start-1">
                        <CardContainer
                            className="min-h-[30vh] h-[30vh]"
                            children1
                            content={<DriverOfTheDay />}
                            title={`Driver of the Day: ${lastRace ? lastRace.name : 'N/A'}`}
                            useScroll={false}
                        />
                    </div>
                    <div className="col-start-2 row-start-1">
                        <CardContainer
                            className="overflow-hidden max-h-[30vh] h-[30vh]"
                            content={<DriverStandings year={YEAR} />}
                            title={`Driver Standings ${YEAR}`}
                        />
                    </div>
                    <div className="row-start-2">
                        <CardContainer
                            className="overflow-hidden h-[20vh]"
                            bodyclassName="h-[20vh]"
                            content={<TotalWinsPod year={lastSeason ?? YEAR} />}
                            title={`${lastSeason} Wins`}
                        />
                        */}
                </div>

                {/* <div className="flex flex-col justify-center items-center mr-2">
                <div
                    className="
                        mt-10
                        flex 
                        flex-col 
                        gap-4
                        grid-rows-3 

                        lg:grid 
                        lg:grid-cols-3 
                        
                        sm:w-[96vw] 
                        md:w-[90vw]
                        lg:w-[80vw]
                        
                        w-[90vw]
                "
                >
                    <div className="row-span-3 left flex flex-col gap-4">
                        <CardContainer
                            className="overflow-hidden h-[20vh]"
                            bodyclassName={'w-full h-[20vh]'}
                            content={<LastRacesAtCircuit />}
                            title={`Previous Results at Circuit`}
                        />

                        <CardContainer
                            className="overflow-hidden h-[20vh]"
                            content={<NextYearSchedule />}
                            title={`${year !== lastSeason ? year : nextYear} Schedule`}
                        />

                        <CardContainer
                            className="overflow-hidden h-[20vh]"
                            bodyclassName="w-full m-0 p-0 h-[20vh]"
                            content={<LastRaceResultsPod year={year} />}
                            title={`Last Race: ${lastRaceResults && lastRaceResults[0] ? lastRaceResults[0].short_name : 'N/A'}`}
                        />
                    </div>
                    <div className="col-span-2 h-[20vh] max-h-[20vh]">
                        <CardContainer
                            className="overflow-hidden max-h-[20vh] h-[20vh]"
                            bodyclassName={'h-[20vh]'}
                            content={<DriverOfTheDay />}
                            title={`Driver of the Day: ${lastRaceResults && lastRaceResults[0] ? lastRaceResults[0].short_name : 'N/A'}`}
                        />
                    </div>
                    <div className="row-span-2 col-start-2 row-start-2 center flex gap-2 flex-col">
                        <CardContainer
                            className="overflow-hidden"
                            bodyclassName="h-[20vh]"
                            content={<TotalWinsPod year={lastSeason ?? YEAR} />}
                            title={`${lastSeason} Wins`}
                        />
                        <CardContainer
                            className="overflow-hidden"
                            bodyclassName="h-[20vh]"
                            content={<TotalWinsPod year={lastSeason - 1} />}
                            title={`${lastSeason - 1} Wins`}
                        />
                    </div>
                    <div className="row-span-2 col-start-3 row-start-2">
                        <CardContainer
                            className={['overflow-hidden', 'h-[40vh] max-h-[40vh]']}
                            content={<DriverStandings year={year} />}
                            title={`Driver Standings ${year}`}
                        />
                    </div>
                </div>
            </div> */}
            </div>
        </>
    );
};

export default Home;
