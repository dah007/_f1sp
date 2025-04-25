import { JSX, useEffect } from 'react';
import { RootState, useAppSelector } from 'app/store';
import { useDispatch } from 'react-redux';

import { setError } from 'slices/siteWideSlice';
import { useGetNextRaceQuery } from 'features/raceApi';
import { setRaceNext } from '@/slices/racesSlice';
import { RaceProps } from '@/types/races';

// TODO: get clock countdown ready for next year (2026)
// import CountdownClock from './CountdownClock';

/**
 * Component to display the next race banner.
 *
 * @component
 * @returns {JSX.Element} A JSX element displaying the next race information or an empty fragment if no race details are provided.
 */
const NextReactBanner: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();

    const raceNext = useAppSelector((state: RootState) => state.races.raceNext);

    const { data: raceNextData, isLoading: raceNextIsLoading, isError: raceNextIsError } = useGetNextRaceQuery(1);

    useEffect(() => {
        if (!raceNextData) return;
        if (raceNextIsLoading) console.info('%cNext race loading...', 'background:green;color:white');
        if (raceNextIsError) dispatch(setError(raceNextIsError));

        // Make sure raceNextData has all required properties before dispatching
        if (raceNextData && 'circuit_id' in raceNextData) {
            dispatch(setRaceNext(raceNextData as unknown as RaceProps)); // Using type assertion as a temporary fix
        }
    }, [raceNextData, raceNextIsError, raceNextIsLoading, dispatch]);

    const renderBanner = () => {
        // ready for next year (2026)
        // if (!raceNext) return <CountdownClock targetDate={'03/14/2026 00:00:00'} />;
        if (!raceNext) return;
        if (!raceNext.date) return;

        return (
            <div className="flex text-2xl racingFont flex-row sm:flex-col">
                <span>{`Next Race: ${raceNext.date || ''} @ `} </span>{' '}
                <span>{`${raceNext.official_name || 'N/A'}`}</span>
            </div>
        );
    };

    return (
        <div
            className="
            flex 
            items-end 
            justify-center 
            gap-2 
            text-center 
            align-middle 
            raceNext 
            racingFont 
            lg:text-3xl 
            md:text-2xl
            text-xl
        "
        >
            {renderBanner()}
        </div>
    );
};

export default NextReactBanner;
