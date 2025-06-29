import { RootState, useAppDispatch, useAppSelector } from '@/app/store';
import { CIRCUIT_DETAILS } from '@/constants/circuitConstants';
import { useGetPreviousWinnersAtCircuitQuery, useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setError } from '@/slices/systemWideSlice';
import type { RaceProps, RaceResultProps } from '@/types/races';
import { useEffect, /*useMemo, */ useState } from 'react';
import { useParams } from 'react-router-dom';

const RaceViewRoute = () => {
    const nextRace = useAppSelector((state: RootState) => state.races.raceNext);

    const dispatch = useAppDispatch();

    const [race, setRace] = useState<Partial<RaceProps>>();
    const [raceResults, setRaceResults] = useState<RaceResultProps[]>([]);

    const { id } = useParams<{ id: string }>();
    let raceId = id ? parseInt(id, 10) : 0;

    if (location.pathname === '/races/next') {
        raceId = nextRace?.id ? nextRace.id : 0;
        setRace(nextRace as Partial<RaceProps>);
    }
    const circuitId = race?.circuit_id || '';

    const {
        data: raceResultsData,
        isLoading: raceResultsLoading,
        isError: raceResultsError,
    } = useGetRacesResultsWithQualQuery(raceId);

    const {
        data: previousFirstPlaceResults,
        isLoading: previousFirstPlaceResultsLoading,
        isError: previousFirstPlaceResultsError,
    } = useGetPreviousWinnersAtCircuitQuery(circuitId) as {
        data: RaceResultProps[] | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (location.pathname !== '/races/next') {
            console.log('shouldnt be here!!!!!');
            if (raceResultsError) {
                console.error('>>>>> Error fetching race results:', raceResultsError);
                dispatch(setError(true));
                return;
            }
            if (raceResultsLoading) {
                console.log('Loading race results...');
                return;
            }
            if (!raceResultsData) return;

            setRace(raceResultsData[0] as Partial<RaceProps>);
            throw new Error('This component should only be used for the next race view');
        }
    }, [raceResultsData, raceResultsError, raceResultsLoading, dispatch]);

    useEffect(() => {
        if (previousFirstPlaceResultsError) {
            console.error('>>>>> Error fetching previous first place results:', previousFirstPlaceResultsError);
            dispatch(setError(true));
            return;
        }
        if (previousFirstPlaceResultsLoading) {
            console.log('Loading previous first place results...');
            return;
        }
        if (!previousFirstPlaceResults) return;

        console.log('Previous first place results:', previousFirstPlaceResults);

        setRaceResults(previousFirstPlaceResults);
    }, [previousFirstPlaceResults, previousFirstPlaceResultsError, previousFirstPlaceResultsLoading, dispatch]);

    if (!race || !raceResults) return <></>;

    // Return the UI conditionally
    return (
        <div className="flex flex-col justify-between items-center p-4 bg-zinc-800 border-b border-zinc-700">
            <div className="flex justify-evenly items-center gap-4 w-full p-4">
                <div>
                    <div className="text-xl font-bold r-2 krona-one-regular">When?</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.date} @ {race.time || 'TBD'} local time
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Where?</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.race_country ?? 'N/A'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Round</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.round || 'TBD'} of {race.total_rounds || 'TBD'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">Circuit Length</div>
                    <div className="pl-4 border-b-2 border-zinc-700 dark:border-zinc-500">
                        {race.course_length ? `${race.course_length} m` : 'TBD'}
                    </div>

                    <div className="text-xl font-bold r-2 krona-one-regular">More Info</div>
                    {race?.circuit_id && CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS]?.wiki && (
                        <a
                            className="text-blue-500 hover:underline"
                            href={CIRCUIT_DETAILS[race.circuit_id as keyof typeof CIRCUIT_DETAILS].wiki ?? ''}
                            rel="noreferrer"
                            target="_blank"
                        >
                            WiKi
                        </a>
                    )}
                </div>

                <div>
                    <img
                        className="max-w-[300px]"
                        alt={race.official_name || race.circuit_id}
                        src={`/assets/tracks/${race.circuit_id}.png`}
                    />
                </div>
            </div>
        </div>
    );
};
export default RaceViewRoute;
