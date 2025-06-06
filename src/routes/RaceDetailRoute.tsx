import { useAppDispatch } from '@/app/store';
import { CIRCUIT_TYPES } from '@/constants/constants';
// import { useGetDriverOfTheDayQuery } from '@/features/driversApi';
import { useGetFastestLapQuery, useGetPollPositionQuery, useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setError } from '@/slices/siteWideSlice';
// import type { DriverOfTheDayProps } from '@/types/drivers';
import type { FastestLap, PolePosition, RaceProps } from '@/types/races';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useImageExists } from '@/hooks/useImageExists'; // Uncomment if you want to use the hook approach

const RaceDetail = () => {
    const dispatch = useAppDispatch();

    const { id } = useParams();

    const raceId = id ? parseInt(id) : 0;

    // const [driverOfTheDay, setDriverOfTheDay] = useState<DriverOfTheDayProps>();
    const [fastestLap, setFastestLap] = useState<FastestLap>();
    // const [fastestPit, setFastestPit] = useState<TNamedObject<string>>();
    const [firstRow, setFirstRow] = useState<RaceProps>();
    const [pollPosition, setPollPosition] = useState<PolePosition>();
    const [raceDetail, setRaceDetail] = useState<RaceProps[]>();
    const [trackImageError, setTrackImageError] = useState<boolean>(false);

    const { data: fastestLapData, isError: fastestLapError } = useGetFastestLapQuery(raceId);
    const { data: pollPositionData, isError: pollPositionError } = useGetPollPositionQuery(raceId);
    const { data: raceResultsData, isError: raceResultsError } = useGetRacesResultsWithQualQuery(raceId);

    useEffect(() => {
        if (fastestLapError) {
            dispatch(setError(true));
            return;
        }
        if (!fastestLapData) return;
        console.log('Fastest Lap:', fastestLapData);
        setFastestLap(fastestLapData);
    }, [fastestLapData, dispatch, fastestLapError]);

    useEffect(() => {
        if (pollPositionError) {
            dispatch(setError(true));
            return;
        }
        if (!pollPositionData) return;
        console.log('Pole Position:', pollPositionData[0]);
        setPollPosition(pollPositionData[0] as unknown as PolePosition);
    }, [pollPositionData, dispatch, pollPositionError]);

    useEffect(() => {
        if (raceResultsError) {
            dispatch(setError(true));
            return;
        }
        if (!raceResultsData) return;
        // Handle the case where raceResultsData might not be an array
        const resultsArray = Array.isArray(raceResultsData) ? raceResultsData : [raceResultsData];
        setFirstRow(resultsArray[0]);
        setRaceDetail(resultsArray as unknown as RaceProps[]);

        console.log(raceDetail);
    }, [raceResultsData, raceResultsError, dispatch]);

    // Reset track image error when circuit changes
    useEffect(() => {
        setTrackImageError(false);
    }, [firstRow?.circuit_id]);

    const getCircuitType = (type: string | undefined | null) => {
        let result = '-';
        Object.entries(CIRCUIT_TYPES).forEach(([key, value]) => {
            if (type === key) {
                result = value;
            }
        });
        return result;
    };

    const getTrackDirection = (direction: string | undefined | null) => {
        if (direction === 'ANTI_CLOCKWISE') {
            return 'Counterclockwise';
        } else if (direction === 'CLOCKWISE') {
            return 'Clockwise';
        }
        return '-';
    };

    return (
        <div className="flex flex-col lg:flex-row w-[80vw] gap-4 mb-4 p-4 border border-red-400">
            {/* LEFT column: Track map */}
            <div className="flex items-start justify-center lg:justify-start flex-shrink-0">
                {!trackImageError && (
                    <img
                        src={trackImageError ? '/assets/images/404.png' : `/assets/tracks/${firstRow?.circuit_id}.png`}
                        alt={trackImageError ? 'Track image not found' : 'track'}
                        width="200"
                        className="max-w-full h-auto"
                        onError={() => setTrackImageError(true)}
                        onLoad={() => setTrackImageError(false)}
                    />
                )}
            </div>
            {/* MIDDLE column: Race stats */}
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
            {/* RIGHT column */}
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
