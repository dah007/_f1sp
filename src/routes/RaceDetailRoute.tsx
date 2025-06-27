import { useAppDispatch, useAppSelector } from '@/app/store';
import { CIRCUIT_TYPES } from '@/constants/constants';
import { useGetFastestLapQuery, useGetPollPositionQuery, useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setRaceDetails } from '@/slices/racesSlice';
import { setError } from '@/slices/systemWideSlice';
import type { FastestLap, PolePosition, RaceProps } from '@/types/races';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * RaceDetail Component
 *
 * A comprehensive race details view that displays track information, race statistics,
 * and key race data in a responsive layout. This component is rendered as a nested
 * route within the RacesRoute component when a specific race is selected.
 *
 * Features:
 * - Track map visualization with fallback error handling
 * - Race statistics (round, laps, distance, etc.)
 * - Performance data (fastest lap, pole position)
 * - Circuit information (type, direction, turns)
 * - Responsive layout that adapts to different screen sizes
 * - Image error handling with fallback to 404 image
 *
 * Layout Structure:
 * - Left: Circuit track image (200px width, responsive)
 * - Middle: Basic race statistics (round, distance, laps, etc.)
 * - Right: Performance data (fastest lap, pole position, circuit details)
 *
 * @returns JSX.Element - Rendered race detail component
 */
const RaceDetail = () => {
    const dispatch = useAppDispatch();

    // Extract race ID from URL parameters
    const { id } = useParams();
    const raceId = id ? parseInt(id) : 0;

    // State for race data
    const [fastestLap, setFastestLap] = useState<FastestLap>();
    const [firstRow, setFirstRow] = useState<RaceProps>();
    const [pollPosition, setPollPosition] = useState<PolePosition>();
    // const [raceDetail, setRaceDetail] = useState<RaceProps[]>();
    const [trackImageError, setTrackImageError] = useState<boolean>(false);

    // API queries for race data
    const { data: fastestLapData, isError: fastestLapError } = useGetFastestLapQuery(raceId);
    const { data: pollPositionData, isError: pollPositionError } = useGetPollPositionQuery(raceId);
    const { data: raceResultsData, isError: raceResultsError } = useGetRacesResultsWithQualQuery(raceId);

    const raceDetail = useAppSelector((state) => state.races.raceDetails);

    // Handle fastest lap data updates
    useEffect(() => {
        if (fastestLapError) {
            dispatch(setError(true));
            return;
        }
        if (!fastestLapData) return;
        console.log('Fastest Lap:', fastestLapData);
        setFastestLap(fastestLapData);
    }, [fastestLapData, dispatch, fastestLapError]);

    // Handle pole position data updates
    useEffect(() => {
        if (pollPositionError) {
            dispatch(setError(true));
            return;
        }
        if (!pollPositionData) return;
        console.log('Pole Position:', pollPositionData[0]);
        setPollPosition(pollPositionData[0] as unknown as PolePosition);
    }, [pollPositionData, dispatch, pollPositionError]);

    // Handle race results data updates
    useEffect(() => {
        if (raceResultsError) {
            dispatch(setError(true));
            return;
        }
        if (!raceResultsData) return;
        // Normalize data to array format
        const resultsArray = Array.isArray(raceResultsData) ? raceResultsData : [raceResultsData];
        setFirstRow(resultsArray[0]); // TODO: redundant?
        dispatch(setRaceDetails(resultsArray[0]));

        console.log(raceDetail);
    }, [raceDetail, raceResultsData, raceResultsError, dispatch]);

    // Reset track image error state when circuit changes
    useEffect(() => {
        setTrackImageError(false);
    }, [firstRow?.circuit_id]);

    // Convert circuit type code to human-readable format
    const getCircuitType = (type: string | undefined | null) => {
        let result = '-';
        Object.entries(CIRCUIT_TYPES).forEach(([key, value]) => {
            if (type === key) {
                result = value;
            }
        });
        return result;
    };

    // Convert track direction to human-readable format
    const getTrackDirection = (direction: string | undefined | null) => {
        if (direction === 'ANTI_CLOCKWISE') {
            return 'Counterclockwise';
        } else if (direction === 'CLOCKWISE') {
            return 'Clockwise';
        }
        return '-';
    };

    return (
        // Main container: responsive flex layout with red border for debugging
        <div className="flex flex-col lg:flex-row w-[90vw] gap-4 mb-4 p-4 border border-red-400">
            {/* LEFT column: Track map */}
            <div className="flex items-start justify-center lg:justify-start flex-shrink-0">
                {!trackImageError && (
                    <img
                        src={trackImageError ? '/assets/images/404.png' : `/assets/tracks/${firstRow?.circuit_id}.png`}
                        alt={trackImageError ? 'Track image not found' : 'track'}
                        width="200"
                        className="max-w-full h-auto"
                        onError={() => setTrackImageError(true)} // Show fallback on load error
                        onLoad={() => setTrackImageError(false)} // Reset error state on successful load
                    />
                )}
            </div>

            {/* MIDDLE column: Basic race statistics */}
            <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left lg:text-md md:text-md">
                <div className="font-semibold whitespace-nowrap">Round:</div>
                <div className="break-words">{firstRow?.round}</div>
                <div className="font-semibold whitespace-nowrap">Total Races Held:</div>
                <div className="break-words">{firstRow?.total_races_held}</div>
                <div className="font-semibold whitespace-nowrap">Turns:</div>
                <div className="break-words">{firstRow?.turns}</div>
                <div className="font-semibold whitespace-nowrap">Course Length:</div>
                <div className="break-words">{firstRow?.course_length} km</div>
                <div className="font-semibold whitespace-nowrap">Race Length:</div>
                <div className="break-words">{firstRow?.distance} km</div>
            </div>

            {/* RIGHT column: Performance data and circuit details */}
            <div className="flex-1 min-w-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left lg:text-md md:text-md">
                <div className="font-semibold whitespace-nowrap">Fastest Lap:</div>
                <div className="break-words">
                    {fastestLap?.driver} - {fastestLap?.time} - Lap {fastestLap?.lap}
                </div>
                <div className="font-semibold whitespace-nowrap">Pole Position:</div>
                <div className="break-words">
                    {pollPosition?.permanent_number} {pollPosition?.driver}
                </div>

                <div className="font-semibold whitespace-nowrap">Type:</div>
                <div className="break-words">{getCircuitType(firstRow?.circuit_type)}</div>
                <div className="font-semibold whitespace-nowrap">Direction:</div>
                <div className="break-words">
                    {getTrackDirection(firstRow?.direction as unknown as string | undefined | null)}
                </div>
                <div className="font-semibold whitespace-nowrap">Laps:</div>
                <div className="break-words">{firstRow?.laps}</div>
            </div>
        </div>
    );
};

export default RaceDetail;
