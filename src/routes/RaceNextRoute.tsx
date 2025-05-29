import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { useGetNextRaceQuery } from '@/features/raceApi';
import { setRaceNext } from '@/slices/racesSlice';
import { setError, setLoading } from '@/slices/siteWideSlice';
import type { NextRaceProps, RaceProps, RaceResultProps } from '@/types/races';
import { useEffect } from 'react';
import PreviousResultsTable from '../components/Race/PreviousResultsTable';
import RaceDetailHeader from '../components/Race/RaceDetailHeader';

const RaceNextRoute = () => {
    const dispatch = useAppDispatch();

    const nextRace = useAppSelector((state: RootState) => state.races.raceNext);
    const race = useAppSelector((state: RootState) => state.races.raceNext) as RaceResultProps | null;

    const { data: nextRaceData, isLoading: nextRaceLoading, isError: nextRaceError } = useGetNextRaceQuery(0);

    useEffect(() => {
        if (nextRaceError) {
            dispatch(setError(true));
            return;
        }
        if (nextRaceLoading) dispatch(setLoading(true));

        if (!nextRaceData) return;
        dispatch(setLoading(false));
        dispatch(setRaceNext(nextRaceData as NextRaceProps));
    }, [nextRace, dispatch, nextRaceData, nextRaceLoading, nextRaceError]);

    const circuitId = race?.circuit_id || '';
    if (!race) return <></>;

    return (
        <>
            <RaceDetailHeader race={race as unknown as RaceProps} />

            <div className="w-full border-t-1 border-zinc-700 dark:border-zinc-500 mt-4 pt-4">
                <h2 className="text-xl font-bold mb-2 krona-one-regular">Results</h2>
                coming soon...
                <PreviousResultsTable circuitId={circuitId} />
            </div>
        </>
    );
};

export default RaceNextRoute;
