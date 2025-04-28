import { useEffect } from 'react';
import { RootState, useAppDispatch, useAppSelector } from 'app/store';

import CardContainer from './CardContainer';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DriverStanding } from '@/types/standings';
import { useGetDriverStandingsQuery } from '@/features/standingsApi';

import { YEAR } from 'constants/constants';
import { setDriverStandings } from '@/slices/standingsSlice';
import { setError } from '@/slices/siteWideSlice';

const DriverStandings = ({ year = YEAR }: { year?: number }): JSX.Element => {
    const dispatch = useAppDispatch();
    const driverStandings = useAppSelector((state: RootState) => state.standings.drivers);

    const { data: driverStandingsData, isError: driverStandingsIsError } = useGetDriverStandingsQuery(year) as {
        data: DriverStanding[] | undefined;
        isLoading?: boolean;
        isError: boolean;
    };

    useEffect(() => {
        if (driverStandingsIsError) {
            dispatch(setError(true));
            return;
        }
        if (!driverStandingsData) return;

        console.info('%cDriverStandings data', 'background:green;color:white', driverStandingsData);

        dispatch(setDriverStandings(driverStandingsData));
    }, [driverStandingsData, dispatch]);

    // if (driverStandingsIsLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (driverStandingsIsError) {
    //     return <div>Error loading driver standings.</div>;
    // }
    if (!driverStandings) {
        return <div className="text-center italic">No driver standings available.</div>;
    }
    return (
        <CardContainer className="overflow-hidden" childrenClassName="w-full m-0 p-0" title="Driver Standings">
            <ScrollArea className="xl:h-[40] md:h-[20vh] h-[14vh] w-full border-t">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-4 text-right">Pos</TableHead>
                            <TableHead className="w-4 text-right">No</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead className="w-4 text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {driverStandings?.map((driver: DriverStanding) => (
                            <TableRow key={driver.driver_id}>
                                <TableCell className="text-right">{driver.position_number}</TableCell>
                                <TableCell className="text-right">{driver.permanent_number}</TableCell>
                                <TableCell>{driver.name}</TableCell>
                                <TableCell className="text-right">{driver.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContainer>
    );
};

export default DriverStandings;

// import { useAppDispatch, useAppSelector } from '@/app/store';
// import { YEAR } from '@/constants/constants';
// import { useGetDriverStandingsQuery } from '@/features/standingsApi';
// import React, { useEffect } from 'react';

// // import { setDriverStandings } from 'slices/standingsSlice';
// import { setError } from 'slices/siteWideSlice';
// // import { useAppDispatch, useAppSelector } from 'app/store';
// // import { useGetDriverStandingsQuery } from 'features/standingsApi';

// import { intlNumberFormat } from 'utils/number';
// import { ScrollArea, ScrollBar } from './ui/scroll-area';

// interface DriverStandingProps {
//     year?: number;
// }

// const DriverStandings: React.FC<DriverStandingProps> = ({ year = YEAR }: DriverStandingProps): JSX.Element => {
//     const driverStandings = useAppSelector((state) => state.standings.drivers);

//     const dispatch = useAppDispatch();

//     const { data: dataDrivers, isError: error } = useGetDriverStandingsQuery(year) as {
//         data: DriverStanding[] | undefined;
//         isError: boolean;
//     };

//     useEffect(() => {
//         if (!dataDrivers) return;
//         console.log('DriverStandings dataDrivers', dataDrivers);
//         dispatch(setDriverStandings(dataDrivers));
//     }, [dataDrivers, dispatch]);

//     if (error) {
//         dispatch(setError(true));
//     }
//     const Drivers = ({ drivers }: { drivers: DriverStanding[] }) => {
//         if (!drivers) return null;

//         return driverStandings?.map((driver) => {
//             return (
//                 <div className="flex w-full gap-4 border-b border-gray-200 p-2 pr-6" key={driver.driver_id}>
//                     <div className="p-0 pl-4 w-8 text-right">{driver.position_number}</div>
//                     <div className="flex-1">{driver.name}</div>
//                     <div className="p-0 pr-8 w-8 text-right">{intlNumberFormat(driver.points)}</div>
//                 </div>
//             );
//         });
//     };

//     return (
//         <div className="p-0 m-0">
//             <div className="flex gap-4 p-2 pr-6 border-b border-gray-200">
//                 <div className="p-0 w-8 ">Pos</div>
//                 <div className="flex-1">Name</div>
//                 <div className="p-0 pr-8 w-8">Points</div>
//             </div>

//             {/* <div className="grid grid-cols-3 grid-rows-1 gap-2"> */}
//             <ScrollArea className="w-full h-full">
//                 <ScrollBar />
//                 {/* <Drivers drivers={driverStandings} /> */}
//             </ScrollArea>
//         </div>
//     );
// };

// export default DriverStandings;
