import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import PreviousResultsTable from '@/components/Race/PreviousResultsTable';
import RaceDetailHeader from '@/components/Race/RaceDetailHeader';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from '@/features/raceApi';
import { setLastRaceResults, setRaceWGP } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/systemWideSlice';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RaceResultsRoute = () => {
    const dispatch = useAppDispatch();

    const { id } = useParams<{ id: string }>();

    // // Only used here, to get the last race id
    // const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as RaceProps | null;

    const {
        data: raceWGPData,
        isLoading: raceWGPisLoading,
        isError: raceWGPisError,
    } = useGetRaceWithGPQuery(parseInt(id as string, 10) || 0) as {
        data: RaceProps | undefined;
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

    const {
        data: dataResults,
        isLoading: dataIsLoading,
        isError: dataIsError,
    } = useGetLastRaceResultsQuery(parseInt(id as unknown as string, 10) || 0) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (dataIsError) {
            dispatch(setError(true));
            return;
        }
        if (dataIsLoading) dispatch(setLoading(true));
        if (!dataResults) return;
        dispatch(setLastRaceResults(dataResults));
        dispatch(setLoading(false));
    }, [dataResults, dataIsError, dataIsLoading, dispatch]);

    if (!raceWGP || !dataResults) return <>Nope.</>;

    console.log('RaceResultsRoute', raceWGP);

    const circuitDetails = CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS];

    return (
        <>
            <div className="flex flex-col justify-between items-center m-0 p-0 pb-8 bg-zinc-800 border-b border-zinc-700">
                <RaceDetailHeader race={raceWGP as unknown as RaceProps} />
                <div className="flex justify-evenly items-center gap-4 w-full p-4">
                    <div>
                        <div className="text-xl font-bold r-2 krona-one-regular">When</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceWGP.date} @ {raceWGP.time || 'TBD'} local time
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Where</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {circuitDetails?.place_name || 'N/A'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {raceWGP.round || 'TBD'} of {raceWGP.total_rounds || 'TBD'}
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                        <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                            {(circuitDetails?.length ?? 1) / 1000 || 'TBD'} km
                        </div>

                        <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                        <div className="pl-4">
                            {raceWGP?.circuit_id &&
                                CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                                    <a
                                        className="text-blue-500 hover:underline"
                                        href={
                                            CIRCUIT_DETAILS[raceWGP.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ??
                                            ''
                                        }
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        WiKi
                                    </a>
                                )}
                        </div>
                    </div>

                    <div>
                        <img
                            className="max-w-[300px]"
                            alt={raceWGP.official_name || raceWGP.circuit_id}
                            src={`/assets/tracks/${raceWGP.circuit_id}.png`}
                        />
                    </div>
                </div>
            </div>
            {/* ? END HEADER! */}

            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <h2 className="text-xl font-bold mb-2 krona-one-regular">Previous Results</h2>

                <PreviousResultsTable circuitId={dataResults ? dataResults[0].circuit_id : ''} />
            </div>
        </>
    );
};
export default RaceResultsRoute;
