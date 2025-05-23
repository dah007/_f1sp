import { useAppDispatch } from '@/app/store';
import { CIRCUIT_TYPES } from '@/constants/constants';
import { useGetDriverOfTheDayQuery } from '@/features/driversApi';
import { useGetRacesResultsWithQualQuery } from '@/features/raceApi';
import { setError } from '@/slices/siteWideSlice';
import type { TNamedObject } from '@/types';
import type { DriverOfTheDayProps } from '@/types/drivers';
import type { FastestLap, PolePosition, RaceProps } from '@/types/races';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RaceDetail = () => {
    const dispatch = useAppDispatch();

    const { id } = useParams();

    const raceId = id ? parseInt(id) : 0;

    const [driverOfTheDay, setDriverOfTheDay] = useState<DriverOfTheDayProps>();
    const [fastestLap, setFastestLap] = useState<FastestLap>();
    const [fastestPit, setFastestPit] = useState<TNamedObject<string>>();
    const [firstRow, setFirstRow] = useState<RaceProps>();
    const [pollPosition, setPollPosition] = useState<PolePosition>();
    const [raceDetail, setRaceDetail] = useState<RaceProps[]>();

    const { data: driverOfTheDayData, isError: driverOfTheDayError } = useGetDriverOfTheDayQuery(raceId) as {
        data: DriverOfTheDayProps[];
        isError: boolean;
    };
    // const { data: fastestLapData, isError: fastestLapError } = useGetFastestLapQuery(raceId) as {
    //     data: FastestLap;
    //     isError: boolean;
    // };
    // const { data: fastestPitData, isError: fastestPitError } = useGetFastestPitStopQuery(raceId) as {
    //     data: TNamedObject<string>[];
    //     isError: boolean;
    // };
    // const { data: pollPositionData, isError: pollPositionError } = useGetPollPositionQuery(raceId) as {
    //     data: PolePosition;
    //     isError: boolean;
    // };
    const { data: raceResultsData, isError: raceResultsError } = useGetRacesResultsWithQualQuery(raceId);

    // if (fastestLapError || fastestPitError || pollPositionError) {
    //     dispatch(setError(true));
    // }
    useEffect(() => {
        if (driverOfTheDayError) {
            dispatch(setError(true));
            return;
        }
        if (!driverOfTheDayData) return;
        console.log('Driver of the Day:', driverOfTheDayData);
        // setDriverOfTheDay(driverOfTheDayData);
    }, [driverOfTheDayData, dispatch, driverOfTheDayError]);

    // useEffect(() => {
    //     if (raceResultsError) {
    //         dispatch(setError(true));
    //         return;
    //     }
    //     if (!fastestLapData) return;
    //     setFastestLap(fastestLapData);
    // }, [fastestLapData, dispatch, fastestLapError]);

    // useEffect(() => {
    //     if (fastestPitError) {
    //         dispatch(setError(true));
    //         return;
    //     }
    //     if (!fastestPitData) return;
    //     setFastestPit(fastestPitData[0]);
    // }, [fastestPitData, dispatch, fastestPitError]);

    // useEffect(() => {
    //     if (driverOfTheDayError) {
    //         dispatch(setError(true));
    //         return;
    //     }
    //     if (!pollPositionData) return;
    //     setPollPosition(pollPositionData);
    // }, [pollPositionData, dispatch, driverOfTheDayError]);

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
        <div className="flex w-full gap-4 mb-4 p-4">
            {/* LEFT column: Track map */}
            <div className="flex items-start justify-start">
                <img src={`/assets/tracks/${firstRow?.circuit_id}.png`} alt="track" width="200" />
            </div>
            {/* RIGH column: Race stats */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left lg:text-md md:text-md">
                <div className="font-semibold">Round:</div>
                <div>{firstRow?.round}</div>
                <div className="font-semibold">Total Races Held:</div>
                <div>{firstRow?.total_races_held}</div>
                <div className="font-semibold">Turns:</div>
                <div>{firstRow?.turns}</div>
                <div className="font-semibold">Course Length:</div>
                <div>{firstRow?.course_length} km</div>
                <div className="font-semibold">Type:</div>
                <div>{getCircuitType(firstRow?.circuit_type)}</div>
                <div className="font-semibold">Direction:</div>
                <div>{getTrackDirection(firstRow?.direction as unknown as string | undefined | null)}</div>
                <div className="font-semibold">Laps:</div>
                <div>{firstRow?.laps}</div>
                <div className="font-semibold">Length:</div>
                <div>{firstRow?.distance} km</div>
            </div>
        </div>
    );
};

export default RaceDetail;

// import React, { useEffect, useState } from 'react';

// import {
//     useGetDriverOfTheDayQuery,
//     useGetFastestLapQuery,
//     useGetFastestPitStopQuery,
//     useGetPollPositionQuery,
//     useGetRaceResultsWithQualQuery,
// } from 'features/raceApi';

// import { useParams } from 'react-router-dom';

// import Flag from 'components/Flag';
// import type { TNamedObject } from '../types';
// import { setError, setSelectedYear } from 'slices/siteWideSlice';

// import type { DriverOfTheDayProps } from 'types/drivers';
// import type { FastestLap, RaceProps } from 'types/races';
// import { RootState, useAppDispatch, useAppSelector } from 'app/store';

// type PolePosition = {
//     permanent_number: number;
//     full_name: string;
// };

// const RaceDetail: React.FC = (): JSX.Element => {
//     const dispatch = useAppDispatch();
//     const selectedYear = useAppSelector((state: RootState) => state.siteWide.selectedYear);
//     const { id } = useParams();
//     const { year: initialYear } = useParams();

//     const [driverOfTheDay, setDriverOfTheDay] = useState<DriverOfTheDayProps>();
//     const [fastestLap, setFastestLap] = useState<FastestLap>();
//     const [fastestPit, setFastestPit] = useState<TNamedObject<string>>();
//     const [firstRow, setFirstRow] = useState<RaceProps>();
//     const [pollPosition, setPollPosition] = useState<PolePosition>();
//     const [, setRaceDetail] = useState<RaceProps[]>(); // holding the getter for later use

//     useEffect(() => {
//         let year = initialYear;
//         if (!year) year = selectedYear.toString();
//         if (year !== selectedYear.toString()) dispatch(setSelectedYear(parseInt(year)));
//     }, [initialYear, selectedYear, dispatch]);

//     // TODO: Add error handling
//     const { data: raceResultsData, isError: raceResultsError } = useGetRaceResultsWithQualQuery(parseInt(id!));
//     const { data: driverOfTheDayData, isError: driverOfTheDayError } = useGetDriverOfTheDayQuery(id!) as {
//         data: DriverOfTheDayProps[];
//         isError: boolean;
//     };
//     const { data: fastestLapData, isError: fastestLapError } = useGetFastestLapQuery(id!) as {
//         data: FastestLap;
//         isError: boolean;
//     };
//     const { data: fastestPitData, isError: fastestPitError } = useGetFastestPitStopQuery(id!) as {
//         data: TNamedObject<string>[];
//         isError: boolean;
//     };
//     const { data: pollPositionData, isError: pollPositionError } = useGetPollPositionQuery(id) as {
//         data: PolePosition;
//         isError: boolean;
//     };

//     if (fastestLapError || fastestPitError || pollPositionError) {
//         dispatch(setError(true));
//     }
//     useEffect(() => {
//         if (driverOfTheDayError) {
//             dispatch(setError(true));
//             return;
//         }
//         setDriverOfTheDay(driverOfTheDayData[0]);
//     }, [driverOfTheDayData, dispatch]);

//     useEffect(() => {
//         if (!fastestLapData) return;
//         setFastestLap(fastestLapData);
//     }, [fastestLapData]);

//     useEffect(() => {
//         if (!fastestPitData) return;
//         setFastestPit(fastestPitData[0]);
//     }, [fastestPitData]);

//     useEffect(() => {
//         if (!pollPositionData) return;
//         setPollPosition(pollPositionData);
//     }, [pollPositionData]);

//     useEffect(() => {
//         if (!raceResultsData) return;
//         // Handle the case where raceResultsData might not be an array
//         const resultsArray = Array.isArray(raceResultsData) ? raceResultsData : [raceResultsData];
//         setFirstRow(resultsArray[0]);
//         setRaceDetail(resultsArray as unknown as RaceProps[]);
//     }, [raceResultsData]);

//     if (raceResultsError) {
//         dispatch(setError(true));
//         return <div className="text-red-500">Error loading data</div>;
//     }

//     return (
//         <div className="flex flex-col w-full h-fit mb-4">
//             <div className="relative flex flex-col w-full lg:h-62 md:h-48 sm:h-24 border border-gray-300 bg-gray-800 rounded-lg p-4">
//                 {/* TITLE */}
//                 <div
//                     className="absolute top-0 text-lg font-bold left-6 lg:text-6xl md:text-4xl md:text-gray-700 text-gray-950"
//                     data-testid="raceTitle"
//                 >
//                     <span>{`${firstRow?.year || ''} ${firstRow?.gp_full_name || ''} `}</span>
//                 </div>
//                 <div
//                     className="absolute top-2 right-4 hover:text-red-800 cursor-pointer text-xl font-bold text-gray-300"
//                     role="link"
//                     aria-label="Close"
//                     onClick={() => window.history.back()}
//                 >
//                     X
//                 </div>

//                 <div className="flex">
//                     {/* WINNER */}
//                     <div
//                         className="
//                         absolute
//                         flex
//                         items-center
//                         text-lg
//                         font-extrabold
//                         text-gray-300
//                         lg:top-8 lg:left-16
//                         md:top-2 md:left-12
//                         top-2 left-8
//                         right-1
//                         w-fit
//                         lg:text-4xl md:text-3xl
//                     "
//                     >
//                         <span>
//                             {`Winner: ${firstRow?.permanent_number || ''} `}
//                             <span data-testid="winnerName">{`${firstRow?.driver_full_name || ''}`}</span>
//                         </span>

//                         <span className="float-right ml-8">
//                             {firstRow?.country_of_birth_country_id ? (
//                                 <Flag
//                                     nameAsId={firstRow?.country_of_birth_country_id}
//                                     sizes={{ lg: '64px', md: '32px', base: '16px' }}
//                                 />
//                             ) : (
//                                 ''
//                             )}
//                         </span>
//                     </div>

//                     {/* STATS */}
//                     <div
//                         className="
//                         absolute
//                         lg:top-26 lg:left-0
//                         md:top-24 md:left-0
//                         sm:top-12 sm:left-0
//                         md:right-[32vw] sm:right-0
//                         top-10 left-8 right-10
//                         w-full flex gap-28
//                         h-fit"
//                     >
//                         <div className="grid grid-flow-col-dense grid-cols-2 gap-4 lg:text-xl md:text-sm">
//                             {/* LEFT SIDE */}
//                             <div className="grid grid-cols-2 gap-2 md:gap-0">
//                                 <div className="text-right">
//                                     <span className="font-bold">Race Time:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="raceTime">{firstRow?.race_time}</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="font-bold">Fastest Lap:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="raceFastestLap">
//                                         {fastestLap?.driver} - {fastestLap?.time}
//                                     </span>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="font-bold">Location:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="racePlace">{`${firstRow?.circuit_name}, ${firstRow?.country_name}`}</span>
//                                 </div>
//                             </div>
//                             {/* RIGHT SIDE */}
//                             <div className="grid grid-cols-2 gap-2 md:pr-6">
//                                 <div className="text-right">
//                                     <span className="font-bold">Poll:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="raceFastestLap">
//                                         {pollPosition?.permanent_number} {pollPosition?.full_name}
//                                     </span>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="font-bold">Driver of the Day:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="driverOfTheDay">{`${driverOfTheDay?.permanent_number} ${driverOfTheDay?.full_name} ${driverOfTheDay?.percentage}%`}</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <span className="font-bold">Fastest Pitstop:</span>
//                                 </div>
//                                 <div>
//                                     <span data-testid="fastestPit">
//                                         {fastestPit?.full_name} - {fastestPit?.time}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RaceDetail;
