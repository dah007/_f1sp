import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import LastResultsTable from '@/components/Race/LastResultsTable';
import PreviousResultsTable from '@/components/Race/PreviousResultsTable';
import RaceDetailHeader from '@/components/Race/RaceDetailHeader';
import { useGetLastRaceResultsQuery, useGetRaceWithGPQuery } from '@/features/raceApi';
import { setLastRaceResults, setRaceWGP } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/siteWideSlice';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { useEffect } from 'react';

const RaceLastRoute = () => {
    const dispatch = useAppDispatch();

    // const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    // Only used here, to get the last race id
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;
    const raceWGP = useAppSelector((state: RootState) => state.races.raceWGP) as RaceProps | null;

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

    const {
        data: dataResults,
        isLoading: dataIsLoading,
        isError: dataIsError,
    } = useGetLastRaceResultsQuery(parseInt(nextRace?.id as unknown as string, 10) - 1 || 0) as {
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

    return (
        <>
            <RaceDetailHeader race={raceWGP!} />
            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <LastResultsTable lastRace={dataResults ? dataResults : []} />
                <PreviousResultsTable circuitId={dataResults ? dataResults[0]?.circuit_id! : ''} />
            </div>
        </>
    );
};
export default RaceLastRoute;
