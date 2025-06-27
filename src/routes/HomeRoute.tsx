'use client';

import { cn } from '@/lib/utils';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';
import CardContainer from 'components/CardContainer';
import DriverOfTheDay from 'components/DriverOfTheDay';
import ErrorDialog from 'components/ErrorDialog';
import NextReactBanner from 'components/NextRaceBanner';
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';
import { InfoIcon } from 'lucide-react';

import type { RaceProps, RaceResultProps } from 'types/races';

import ConstructorStandings from '@/components/ConstructorsStandingsTable';
import DriverStandingsChart from '@/components/DriverStandingsChart';
import LastRaceResultsPod from '@/components/LastRaceResultsPod';
import TotalWinsPerYear from '@/components/TotalWinsPerYear';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRaceWithGPQuery } from '@/features/raceApi';
import { setRaceWGP } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import { useEffect } from 'react';
import { selectError } from 'selectors/systemWideSelector';

interface MessageFromURLResult {
    success: string | null;
    error: string | null;
    message: string | null;
}

const getMessageFromURL: () => MessageFromURLResult = () => {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        success: urlParams.get('success'),
        error: urlParams.get('error'),
        message: urlParams.get('message'),
    };
};

const Home: React.FC = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector((state: RootState) => state.systemWide.loading);
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as Partial<RaceProps> | null;
    const systemError = useAppSelector((state: RootState) => selectError(state));

    const {
        data: raceWGPData,
        isLoading: raceWGPisLoading,
        isError: raceWGPisError,
    } = useGetRaceWithGPQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
        data: Partial<RaceProps> | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (raceWGPisError) {
            dispatch(setError(true));
            return;
        }
        if (raceWGPisLoading) dispatch(setLoading(true));
        if (!raceWGPData) return;
        dispatch(setRaceWGP(raceWGPData));
        dispatch(setLoading(false));
    }, [raceWGPData, raceWGPisError, raceWGPisLoading, dispatch]);

    const widthsNHeights = 'h-[25vh] md:h-[35vh]';

    const { success: voteSuccessful, message: voteMessage } = getMessageFromURL();

    /**
     * Alert message box with a title, optional description, and optional children.
     *
     * @component
     * @param {Object} props - The properties that define the MessageBox.
     * @param {string} props.title - The title of the message box.
     * @param {string} [props.description] - Optional description text for the message box.
     * @param {string} [props.className] - Optional CSS class name to apply additional styling.
     * @param {React.ReactNode} [props.children] - Optional children elements to render inside the message box.
     * @returns {JSX.Element} A styled alert component with the provided content.
     */
    const MessageBox = ({
        title,
        description,
        className,
        children,
    }: {
        title: string;
        description?: string;
        className?: string;
        children?: React.ReactNode;
    }) => {
        return (
            <Alert className={cn('flex flex-col items-start justify-start', className)}>
                <div className="flex w-full gap-4">
                    <InfoIcon color="green" className="h-8 w-8" />
                    <AlertTitle className="text-xl text-center font-bold krona-one-regular">{title}</AlertTitle>
                </div>

                <AlertDescription>{description}</AlertDescription>
                {children}
            </Alert>
        );
    };

    return (
        <>
            {/* <Outlet /> */}

            {isLoading && <div>Loading...</div>}

            {voteSuccessful && (
                <MessageBox title="Vote">
                    <p className="text-xl text-center ">{voteMessage}</p>
                </MessageBox>
            )}

            <NextReactBanner />
            {systemError && <ErrorDialog />}

            <div className="flex flex-col justify-center items-center mr-2">
                <div
                    className="
                lg:grid
                lg:gzrid-cols-3
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
                        <Card
                            className={cn(
                                'bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700 overflow-hidden',
                                widthsNHeights,
                            )}
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    Last Race: {raceWGP ? raceWGP.official_name : 'N/A'}
                                </CardTitle>
                                <CardContent>
                                    <LastRaceResultsPod />
                                </CardContent>
                            </CardHeader>
                        </Card>
                        {/* <CardContainer
                            className={cn('overflow-hidden relative', widthsNHeights)}
                            title={`Last Race: ${raceWGP ? raceWGP.official_name : 'N/A'}`}
                        >
                            <LastRaceResultsPod />
                        </CardContainer> */}
                    </div>

                    <div className={cn('col-start-1', 'row-start-2', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden', 'bg-zinc-900/50', widthsNHeights)}
                            title="Constructors Standings"
                        >
                            <ConstructorStandings />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-1 md:col-start-2 row-start-3 md:row-start-2 ', widthsNHeights)}>
                        <CardContainer className={cn('overflow-hidden', widthsNHeights)} title="Total Wins">
                            <TotalWinsPerYear />
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-2 row-start-1 col-span-2', widthsNHeights)}>
                        <CardContainer
                            className={cn('overflow-hidden', widthsNHeights)}
                            title={`Driver Standings`}
                            childrenClassName="flex flex-col items-end h-full justify-end w-full"
                        >
                            <DriverStandingsChart />

                            <CardFooter className="w-full text-left">
                                <button
                                    rel="link"
                                    onClick={() => (location.href = '/standings')}
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer font-semibold text-sm"
                                >
                                    View Full Standings
                                </button>
                            </CardFooter>

                            {/* 
                            TODO: MAKE THIS A POPOVER on the GRAPH ON CLICK */}
                            {/* <div className={cn('col-start-2 row-start-2', widthsNHeights, 'bg-blue-400')}>
                                <CardContainer
                                    className={cn('overflow-hidden', widthsNHeights)}
                                    childrenClassName="w-full m-0 p-0"
                                    title="Driver Standings"
                                >
                                    <DriverStandings />
                                </CardContainer>
                            </div> */}
                        </CardContainer>
                    </div>

                    <div className={cn('col-start-3 row-start-2', widthsNHeights)}>
                        <CardContainer className={cn('overflow-hidden', widthsNHeights)} title="Driver of the Day">
                            <DriverOfTheDay />
                        </CardContainer>
                    </div>

                    {/* <EnhancedRaceResults raceData={raceWGP} /> */}
                </div>
            </div>
        </>
    );
};

export default Home;
