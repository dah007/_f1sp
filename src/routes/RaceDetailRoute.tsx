import { useAppDispatch } from '@/app/store';
import { CIRCUIT_TYPES } from '@/constants/constants';
// import { useGetDriverOfTheDayQuery } from '@/features/driversApi';
import { useGetFastestLapQuery, useGetPollPositionQuery, useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setError } from '@/slices/siteWideSlice';
// import type { DriverOfTheDayProps } from '@/types/drivers';
import type { FastestLap, PolePosition, RaceProps } from '@/types/races';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        <div className="flex w-full gap-4 mb-4 p-4 border border-red-400">
            {/* LEFT column: Track map */}
            <div className="flex items-start justify-start">
                <img src={`/assets/tracks/${firstRow?.circuit_id}.png`} alt="track" width="200" />
            </div>
            {/* MIDDLE column: Race stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left lg:text-md md:text-md">
                <div className="font-semibold">Round:</div>
                <div>{firstRow?.round}</div>
                <div className="font-semibold">Total Races Held:</div>
                <div>{firstRow?.total_races_held}</div>
                <div className="font-semibold">Turns:</div>
                <div>{firstRow?.turns}</div>
                <div className="font-semibold">Course Length:</div>
                <div>{firstRow?.course_length} km</div>
                <div className="font-semibold">Race Length:</div>
                <div>{firstRow?.distance} km</div>
            </div>
            {/* RIGHT column */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left lg:text-md md:text-md max-w-[13vw]">
                <div className="font-semibold w-[2w]">Fastest Lap:</div>
                <div>
                    {fastestLap?.driver} - {fastestLap?.time} - Lap {fastestLap?.lap}
                </div>
                <div className="font-semibold w-[15vw]">Pole Position:</div>
                <div>
                    {pollPosition?.permanent_number} {pollPosition?.driver}
                </div>

                <div className="font-semibold">Type:</div>
                <div>{getCircuitType(firstRow?.circuit_type)}</div>
                <div className="font-semibold">Direction:</div>
                <div>{getTrackDirection(firstRow?.direction as unknown as string | undefined | null)}</div>
                <div className="font-semibold">Laps:</div>
                <div>{firstRow?.laps}</div>
            </div>
        </div>
    );
};

export default RaceDetail;
