const DriverStandings = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-2 pr-6 border-b border-gray-200">
                <div className="p-0 w-8 ">Pos</div>
                <div className="flex-1">Name</div>
                <div className="p-0 pr-8 w-8">Points</div>
            </div>
        </div>
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
//         data: IDriverStanding[] | undefined;
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
//     const Drivers = ({ drivers }: { drivers: IDriverStanding[] }) => {
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
